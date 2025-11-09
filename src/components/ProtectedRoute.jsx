import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Protected Route
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user, token } = useAuthStore();

  // Kiểm tra authentication: cần có token và user
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
