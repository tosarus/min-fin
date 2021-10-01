import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useAuth } from '../auth';

export const LoginLogout = ({ ...props }: ButtonProps) => {
  const { isAuthenticated, auth } = useAuth();
  const handleLogin = () => auth.login({ prompt: 'login' });
  const handleLogout = () => auth.logout({ returnTo: window.location.origin });

  return (
    <Button onClick={isAuthenticated ? handleLogout : handleLogin} {...props}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
};
