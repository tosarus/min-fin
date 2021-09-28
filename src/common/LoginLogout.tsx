import React from 'react';
import { Theme, ButtonProps, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useAuth } from '../auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginLeft: theme.spacing(3),
    },
  })
);

export const LoginLogout = ({ ...props }: ButtonProps) => {
  const { isAuthenticated, auth } = useAuth();
  const handleLogin = () => auth.login({ prompt: 'login' });
  const handleLogout = () => auth.logout({ returnTo: window.location.origin });
  const classes = useStyles();

  return (
    <Button
      className={classes.menuButton}
      color="inherit"
      onClick={isAuthenticated ? handleLogout : handleLogin}
      {...props}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
};
