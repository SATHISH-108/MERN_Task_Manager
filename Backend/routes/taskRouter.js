import express from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  assignTask,
} from "../controllers/TaskController.js";
import { Protected, AuthorizationRoles } from "../middleware/auth.js";
const taskRouter = express.Router();

taskRouter.get("/", Protected, getTasks);
taskRouter.post("/", Protected, AuthorizationRoles("admin"), createTask);
// PUT allowed for both admin (any edit) and user (mark own task complete — enforced in controller)
taskRouter.put("/:id", Protected, updateTask);
taskRouter.delete("/:id", Protected, AuthorizationRoles("admin"), deleteTask);
taskRouter.post(
  "/:id/assign",
  Protected,
  AuthorizationRoles("admin"),
  assignTask,
);
export default taskRouter;
