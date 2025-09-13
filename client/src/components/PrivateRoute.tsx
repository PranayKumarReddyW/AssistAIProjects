import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store/store";
import React from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  // You can add more robust logic here (e.g., check user, token expiry, etc.)
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
