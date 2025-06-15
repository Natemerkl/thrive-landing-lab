
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminAccessGuardProps {
  children: React.ReactNode;
}

const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({ children }) => {
  const { user, userRole } = useAuth();

  // Redirect if not admin
  if (userRole !== 'admin' && user?.email !== 'nattyesquire@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminAccessGuard;
