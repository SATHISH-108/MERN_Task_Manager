import { useEffect, useState } from "react";
import API from "../api/axios";
import { socket } from "../socket/socket";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  const getStats = async () => {
    try {
      const response = await API.get("/dashboard/stats");
      setStats(response.data || {});
    } catch (error) {
      console.log(
        "Dashboard stats error:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    getStats();
    socket.on("taskUpdated", getStats);
    return () => socket.off("taskUpdated", getStats);
  }, []);

  const topUsers = stats.topUsers || [];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Total Tasks" value={stats.totalTasks} />
        <Card title="Completed Tasks" value={stats.completedTasks} />
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Top 5 Active Users</h2>
        {topUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">No active users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">#</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2 text-right">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, idx) => (
                <tr key={u._id || idx} className="border-b last:border-0">
                  <td className="py-2">{idx + 1}</td>
                  <td className="py-2 font-medium">{u.name || "—"}</td>
                  <td className="py-2 text-gray-600">{u.email || "—"}</td>
                  <td className="py-2 text-right font-semibold">{u.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="bg-white shadow p-4 rounded text-center">
    <h3 className="text-gray-600">{title}</h3>
    <p className="text-2xl font-bold">{value ?? 0}</p>
  </div>
);
