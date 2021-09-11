import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Theme, ButtonProps, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginLeft: theme.spacing(3),
    },
  })
);

export const LoginLogout = ({ ...props }: ButtonProps) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const handleLogin = () => loginWithRedirect({ prompt: 'login' });
  const handleLogout = () => logout({ returnTo: window.location.origin });
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
