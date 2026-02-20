import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./style/Theme.css";
import "./style/Qmed.css"
import "./style/QmedCheckout.css"
import Missing from "./views/Missing";
import Unauthorized from "./views/Unauthorize";
import { SocketProvider } from "./context/SocketContext";
import SelectType from "./views/pages/SelectType";
import ProtectedRoute from "./components/socket/ProtectedRoute";
import QueueScreen from "./views/QueueScreen";
import Queue_Checkout from "./views/Queue_Checkout";

function App() {
  return (
    <>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/type" replace />} />
            <Route path="/type" element={<SelectType />} />
            <Route path="/queue" element={<ProtectedRoute><QueueScreen /></ProtectedRoute>} />
            <Route path="/queuecut" element={<ProtectedRoute><Queue_Checkout /></ProtectedRoute>} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Missing />} />
        </Routes>
      </SocketProvider>
    </>
  )
}

export default App