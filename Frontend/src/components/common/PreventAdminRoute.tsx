import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import type { ReactNode } from "react";

interface PreventAdminRouteProps {
  children: ReactNode;
}

const PreventAdminRoute = ({ children }: PreventAdminRouteProps) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PreventAdminRoute;
