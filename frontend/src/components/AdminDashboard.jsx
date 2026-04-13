import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskFilters from "../components/TaskFilters";
import API from "../api/axios";
import { socket } from "../socket/socket";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(1);

  const fetchTasks = async (filters = query, pageNum = page) => {
    try {
      const params = new URLSearchParams({ ...filters, page: pageNum });
      const { data } = await API.get(`/tasks?${params.toString()}`);
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.log("Admin tasks fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  useEffect(() => {
    const handler = () => fetchTasks();
    socket.on("taskUpdated", handler);
    return () => socket.off("taskUpdated", handler);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded shadow">
          <TaskForm fetchTasks={fetchTasks} />
        </div>

        <div className="lg:col-span-2">
          <TaskFilters
            onFilter={(f) => {
              setQuery(f);
              fetchTasks(f, 1);
            }}
          />

          <TaskList tasks={tasks} isAdmin={true} fetchTasks={fetchTasks} />

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
