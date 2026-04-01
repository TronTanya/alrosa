import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { isAuthed } from "./auth/session";

export function RequireAuth() {
  const location = useLocation();

  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
