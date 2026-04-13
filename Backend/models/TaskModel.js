import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "pending", required: true },
    difficulty: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const TaskModel = mongoose.models.Task || mongoose.model("Tasks", taskSchema);
export default TaskModel;
