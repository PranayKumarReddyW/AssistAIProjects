import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:9000";
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("[Socket] Connected to:", SOCKET_URL, "as", socket.id);
});
socket.on("disconnect", () => {
  console.log("[Socket] Disconnected");
});

export default socket;
