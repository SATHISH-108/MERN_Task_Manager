import { io } from "socket.io-client";

export const socket = io("http://localhost:7001", {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: true,
});
