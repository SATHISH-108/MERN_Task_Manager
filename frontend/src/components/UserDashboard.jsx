import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskList from "../components/TaskList";
import TaskFilters from "../components/TaskFilters";
import { socket } from "../socket/socket";

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState({});

  const fetchTasks = async (filters = query) => {
    try {
      const params = new URLSearchParams(filters);
      const { data } = await API.get(`/tasks?${params.toString()}`);
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.log("User tasks fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    const handler = () => fetchTasks();
    socket.on("taskUpdated", handler);
    return () => socket.off("taskUpdated", handler);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      <TaskFilters
        onFilter={(f) => {
          setQuery(f);
          fetchTasks(f);
        }}
      />

      <TaskList tasks={tasks} isAdmin={false} fetchTasks={fetchTasks} />
    </div>
  );
};

export default UserDashboard;
