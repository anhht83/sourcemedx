import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { AdminPermission } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: AdminPermission[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPermissions }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      user?.role?.permissions?.includes(permission)
    );
    if (!hasRequiredPermissions) {
      return <Navigate to="/admin/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
