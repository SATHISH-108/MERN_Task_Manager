import { useEffect, useState } from "react";
import API from "../api/axios";

const TaskForm = ({ fetchTasks }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Users fetch error:", err.response?.data || err.message);
      }
    };
    getUsers();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/tasks", task);
      if (task.assignedTo) {
        await API.post(`/tasks/${response.data._id}/assign`, {
          userId: task.assignedTo,
        });
      }
      setTask({
        title: "",
        description: "",
        difficulty: "easy",
        assignedTo: "",
      });
      fetchTasks();
    } catch (err) {
      console.log("Create task error:", err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-3">
      <h2 className="font-bold text-lg">Create Task</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        rows={3}
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <select
        className="w-full border p-2 rounded"
        value={task.difficulty}
        onChange={(e) => setTask({ ...task, difficulty: e.target.value })}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        className="w-full border p-2 rounded"
        value={task.assignedTo}
        onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
      >
        <option value="">Assign User</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      <button className="w-full bg-blue-500 text-white p-2 rounded">
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
