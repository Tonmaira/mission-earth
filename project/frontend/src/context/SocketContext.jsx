import { createContext, useContext, useEffect, useRef, useState } from "react";
import { socket } from "../middleware/socket";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const lastUpdateRef = useRef(0);
    const [connected, setConnected] = useState(false);
    const [queue, setQueue] = useState([]);
    const [BroadcastParams, setBroadcastParams] = useState("");
  
    const connectSocket = BroadcastParams => {
      if (!BroadcastParams) return;
      if (socket.connected) return;
  
      setBroadcastParams(BroadcastParams);
      localStorage.setItem("BroadcastParams", BroadcastParams); // ✅ save
  
      socket.io.opts.query = { BroadcastParams };
      socket.connect();
    };
  
    const disconnectSocket = () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  
    // 🔁 AUTO RECONNECT ON REFRESH
    useEffect(() => {
      const savedType = localStorage.getItem("BroadcastParams");
      if (savedType && !socket.connected) {
        console.log("♻️ Reconnect with BroadcastParams:", savedType);
        connectSocket(savedType);
      }
    }, []);
  
    useEffect(() => {
      socket.on("connect", () => {
        console.log("✅ Connected");
        setConnected(true);
        socket.emit("queue:refresh");
      });
  
      socket.on("disconnect", reason => {
        console.log("❌ Disconnected:", reason);
        setConnected(false);
        setQueue([]);
        lastUpdateRef.current = 0;
      });
  
      socket.on("queue:init", res => {
        if (Array.isArray(res?.data)) setQueue(res.data);
      });
  
      socket.on("queue:update", payload => {
        if (
          Array.isArray(payload?.data) &&
          payload.updatedAt > lastUpdateRef.current
        ) {
          lastUpdateRef.current = payload.updatedAt;
          setQueue(payload.data);
        }
      });
  
      return () => socket.off();
    }, []);
  
    // ⏱️ refresh every 15 min
    useEffect(() => {
      if (!connected) return;
  
      const interval = setInterval(() => {
        socket.emit("queue:refresh");
        console.log("🔄 queue refresh");
      }, 900000);
  
      return () => clearInterval(interval);
    }, [connected]);
  
    return (
      <SocketContext.Provider
        value={{
          connected,
          queue,
          BroadcastParams,
          connectSocket,
          disconnectSocket
        }}
      >
        {children}
      </SocketContext.Provider>
    );
  }  

  export const useSocket = () => useContext(SocketContext);