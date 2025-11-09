import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

// Protected Route
export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
