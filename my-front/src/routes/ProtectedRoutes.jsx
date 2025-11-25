import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../service/auth';

export default function ProtectedRoute({ adminOnly = false }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/catalog" replace />;
  }

  return <Outlet />;
}
