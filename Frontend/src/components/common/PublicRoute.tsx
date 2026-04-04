import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    if (user?.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "EVENT_MANAGER") return <Navigate to="/eventmanager/profile" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
