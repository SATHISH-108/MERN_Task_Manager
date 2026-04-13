import express from "express";
import { getStats } from "../services/DashboardStats.js";
import { Protected, AuthorizationRoles } from "../middleware/auth.js";
const dashboardRouter = express.Router();
dashboardRouter.get("/stats", Protected, AuthorizationRoles("admin"), getStats);
export default dashboardRouter;
