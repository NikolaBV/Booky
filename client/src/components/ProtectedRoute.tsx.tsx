import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signIn" replace />;
  }

  return <Outlet />;
}
