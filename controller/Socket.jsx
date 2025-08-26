// socket.js
import { io } from "socket.io-client";
import { API } from "./Api";

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect(); // Clean up old connection
  }

  socket = io(`${API.api_url}`, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected");
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket error:", err.message);
  });
};

export const getSocket = () => socket;
