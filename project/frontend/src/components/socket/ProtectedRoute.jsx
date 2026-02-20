import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const BroadcastParams = localStorage.getItem("BroadcastParams");

  if (!BroadcastParams) {
    return <Navigate to="/" replace />;
  }

  return children;
}
