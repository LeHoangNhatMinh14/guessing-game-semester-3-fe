import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Make sure this is imported correctly

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role?.replace("ROLE_", "").toLowerCase();

    // Check role only if requiredRole is specified
    if (requiredRole && userRole !== requiredRole.toLowerCase()) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
