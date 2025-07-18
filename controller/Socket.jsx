// socket.js
import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect(); // Clean up old connection
  }

  socket = io("http://192.168.29.173:3000", {
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
