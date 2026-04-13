import express from "express";
import { loginLimiter } from "../middleware/rateLimiter.js";
import {
  refresh,
  usersLogin,
  usersRegister,
  logout,
} from "../controllers/UsersController.js";
import UserModel from "../models/UserModel.js";
import { Protected, AuthorizationRoles } from "../middleware/auth.js";

const usersRouter = express.Router();

// Spec paths
usersRouter.post("/register", usersRegister);
usersRouter.post("/login", loginLimiter, usersLogin);
usersRouter.post("/refresh", refresh);
usersRouter.post("/logout", logout);

// Back-compat aliases
usersRouter.post("/signup", usersRegister);
usersRouter.post("/signin", loginLimiter, usersLogin);

// Admin-only: list users (used by task assign dropdown)
usersRouter.get("/", Protected, AuthorizationRoles("admin"), async (req, res) => {
  const users = await UserModel.find().select("_id name email role");
  res.json(users);
});

export default usersRouter;
