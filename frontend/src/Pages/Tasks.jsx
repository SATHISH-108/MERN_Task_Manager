import { useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../socket/socket";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) {
      console.log("Tasks fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on("taskUpdated", fetchTasks);
    return () => socket.off("taskUpdated", fetchTasks);
  }, []);

  return (
    <div className="p-4 grid md:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div key={task._id} className="bg-white p-4 shadow rounded">
          <h3 className="font-bold">{task.title}</h3>
          <p>{task.description}</p>
          <span className="text-sm">{task.status}</span>
        </div>
      ))}
    </div>
  );
}
