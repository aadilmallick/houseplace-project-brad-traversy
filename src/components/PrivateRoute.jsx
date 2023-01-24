import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

export const PrivateRoute = () => {
  const { loggedIn, loading } = useAuthStatus();

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};
