import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store/store";
import React from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"doctor" | "patient" | "admin">;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/notfound" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
