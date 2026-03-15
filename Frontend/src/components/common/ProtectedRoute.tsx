import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'EVENT_MANAGER') return <Navigate to="/eventmanager/profile" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
