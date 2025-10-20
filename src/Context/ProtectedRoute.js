import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { authState, logout } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);

  // User logged in if authState exists and userRole exists
  const isLoggedIn = !!(authState && authState.user && authState.user.userRole);

  const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  const isAuthorized =
    isLoggedIn && allowedRolesArray.includes(authState.user.userRole);

  // Loading ends once authState is fetched, regardless of whether user exists
  useEffect(() => {
    if (authState !== null) {
      setIsLoading(false);
    }
  }, [authState]);

  useEffect(() => {
    if (!isLoading && isLoggedIn && !isAuthorized) {
      logout();
    }
  }, [isLoading, isLoggedIn, isAuthorized, logout]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
