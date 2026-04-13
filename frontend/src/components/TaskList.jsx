import { useState } from "react";
import API from "../api/axios";

const TaskList = ({ tasks, isAdmin, fetchTasks }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    status: "pending",
  });

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const completeTask = async (id) => {
    await API.put(`/tasks/${id}`, { status: "completed" });
    fetchTasks();
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setEditData({
      title: t.title || "",
      description: t.description || "",
      difficulty: t.difficulty || "easy",
      status: t.status || "pending",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/tasks/${id}`, editData);
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.log("Edit task error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {tasks.map((t) => (
        <div
          key={t._id}
          className="bg-white p-4 rounded shadow hover:shadow-lg transition"
        >
          {editingId === t._id ? (
            <div className="space-y-2">
              <input
                className="w-full border p-2 rounded"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="Title"
              />
              <textarea
                className="w-full border p-2 rounded"
                rows={3}
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Description"
              />
              <select
                className="w-full border p-2 rounded"
                value={editData.difficulty}
                onChange={(e) =>
                  setEditData({ ...editData, difficulty: e.target.value })
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                className="w-full border p-2 rounded"
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(t._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-300 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-lg">{t.title}</h3>
              {t.description && (
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                  {t.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Status: <span className="font-semibold">{t.status}</span>
              </p>
              <p className="text-sm">Difficulty: {t.difficulty}</p>
              {t.assignedTo?.name && (
                <p className="text-sm text-gray-600">
                  Assigned to: {t.assignedTo.name}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => startEdit(t)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}

                {!isAdmin && t.status !== "completed" && (
                  <button
                    onClick={() => completeTask(t._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Complete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
