import UserModel from "../models/UserModel.js";
import TaskModel from "../models/TaskModel.js";
import { redis } from "../config/redis.js";

const DASHBOARD_CACHE_KEY = "dashboard:stats";
const CACHE_TTL = 5 * 60; // 5 minutes

export const getStats = async (req, res) => {
  try {
    try {
      const cached = await redis.get(DASHBOARD_CACHE_KEY);
      if (cached) return res.json(JSON.parse(cached));
    } catch (e) {
      console.error("Redis GET error:", e.message);
    }

    const [totalUsers, totalTasks, completedTasks, topAgg] = await Promise.all([
      UserModel.countDocuments(),
      TaskModel.countDocuments(),
      TaskModel.countDocuments({ status: "completed" }),
      TaskModel.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            count: 1,
            name: "$user.name",
            email: "$user.email",
          },
        },
      ]),
    ]);

    const payload = {
      totalUsers,
      totalTasks,
      completedTasks,
      topUsers: topAgg,
    };

    try {
      await redis.set(
        DASHBOARD_CACHE_KEY,
        JSON.stringify(payload),
        "EX",
        CACHE_TTL,
      );
    } catch (e) {
      console.error("Redis SET error:", e.message);
    }

    res.json(payload);
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
