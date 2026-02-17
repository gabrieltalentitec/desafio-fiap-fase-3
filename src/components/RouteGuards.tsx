import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  // Evita "flicker" de redirecionamento enquanto a sessão ainda está sendo restaurada.
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isTeacher, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isTeacher) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const TeacherOnlyRegisterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isTeacher, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isTeacher) return <Navigate to="/" replace />;
  return <>{children}</>;
};
