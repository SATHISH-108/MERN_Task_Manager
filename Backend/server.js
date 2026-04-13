import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import dbConnection from "./config/dbConnection.js";
import { redisSub } from "./config/redis.js";
import authRouter from "./routes/usersRouter.js";
import taskRouter from "./routes/taskRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";

dotenv.config();
dbConnection();

const app = express();
const PORT = process.env.PORT || 7002;

const server = http.createServer(app);
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "https://mern-task-manager-hnjf.vercel.app/";

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => res.send("API Working"));

// Spec-required API paths
app.use("/auth", authRouter);
app.use("/tasks", taskRouter);
app.use("/dashboard", dashboardRouter);

// Back-compat aliases
app.use("/api/users", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/dashboard", dashboardRouter);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// Redis Pub/Sub — broadcast task events across all server instances
redisSub.subscribe("task-events", (err) => {
  if (err) console.error("Redis subscribe error:", err);
});
redisSub.on("message", (channel, message) => {
  if (channel === "task-events") {
    try {
      io.emit("taskUpdated", JSON.parse(message));
    } catch {
      io.emit("taskUpdated");
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server + Socket running at http://localhost:${PORT}`);
});
