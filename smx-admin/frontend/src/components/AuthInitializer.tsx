import React, { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { getCurrentUser } from '../features/auth/authSlice';
import { authService } from '../services/auth.service';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
