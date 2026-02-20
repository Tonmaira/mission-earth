import { io } from "socket.io-client";
const BCUrl = import.meta.env.VITE_REACT_APP_API_BCURL || "http://localhost:5000";

export const socket = io(BCUrl, {
  transports: ["websocket"],
  autoConnect: false,

  // 🔥 reconnect config
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,        // เริ่ม 1 วิ
  reconnectionDelayMax: 10000,    // max 10 วิ
  timeout: 20000,
});
