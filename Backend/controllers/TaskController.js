import TaskModel from "../models/TaskModel.js";
import { redis } from "../config/redis.js";

const TASKS_CACHE_PREFIX = "tasks:list:";
const DASHBOARD_CACHE_KEY = "dashboard:stats";
const CACHE_TTL = 5 * 60; // 5 minutes

// Invalidate every cached /tasks list variant + dashboard, then publish
const invalidateAndBroadcast = async (req, event) => {
  try {
    const keys = await redis.keys(`${TASKS_CACHE_PREFIX}*`);
    if (keys.length) await redis.del(keys);
    await redis.del(DASHBOARD_CACHE_KEY);
  } catch (e) {
    console.error("Cache invalidation error:", e.message);
  }
  try {
    await redis.publish("task-events", JSON.stringify(event));
  } catch (e) {
    // Fallback to direct socket emit if publish fails
    if (req.io) req.io.emit("taskUpdated", event);
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await TaskModel.create(req.body);
    await invalidateAndBroadcast(req, { type: "created", taskId: task._id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      difficulty,
      search,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.title = { $regex: search, $options: "i" };
    if (req.user.role !== "admin") query.assignedTo = req.user.id;

    const cacheKey =
      TASKS_CACHE_PREFIX +
      JSON.stringify({
        userId: req.user.id,
        role: req.user.role,
        page,
        limit,
        status: status || "",
        difficulty: difficulty || "",
        search: search || "",
      });

    try {
      const cached = await redis.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    } catch (e) {
      console.error("Redis GET error:", e.message);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);

    const [tasks, total] = await Promise.all([
      TaskModel.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("assignedTo", "name email"),
      TaskModel.countDocuments(query),
    ]);

    const payload = {
      tasks,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    };

    try {
      await redis.set(cacheKey, JSON.stringify(payload), "EX", CACHE_TTL);
    } catch (e) {
      console.error("Redis SET error:", e.message);
    }

    res.json(payload);
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const assignTask = async (req, res) => {
  try {
    const task = await TaskModel.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      { new: true },
    );
    await invalidateAndBroadcast(req, { type: "assigned", taskId: req.params.id });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error assigning task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    // Users may only update status on their own tasks (e.g. mark complete).
    if (req.user.role !== "admin") {
      const existing = await TaskModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Task not found" });
      if (String(existing.assignedTo) !== String(req.user.id)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }
    const task = await TaskModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await invalidateAndBroadcast(req, { type: "updated", taskId: req.params.id });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);
    await invalidateAndBroadcast(req, { type: "deleted", taskId: req.params.id });
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
};
