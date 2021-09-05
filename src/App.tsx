import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  AppBar,
  Button,
  ButtonProps,
  Container,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ForecastTable } from './ForecastTable';
import { ReportSnackbar } from './ReportSnackbar';
import { Actions, useForecast } from './store';
import { useDispatchedRender } from './useDispatchedRender';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const LoginLogout = ({ ...props }: ButtonProps) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const handleLogin = () => loginWithRedirect({ prompt: 'login' });
  const handleLogout = () => logout({ returnTo: window.location.origin, federated: true });

  return (
    <Button {...props} onClick={isAuthenticated ? handleLogout : handleLogin}>
      {isAuthenticated ? 'Logout' : 'Login'}
    </Button>
  );
};

const PublicApp = () => <Typography variant="h5">Hi. Please login.</Typography>;

const PrivateApp = () => {
  const { user } = useAuth0();
  const renderForecast = useDispatchedRender(useForecast, Actions.loadWeatherForecast);

  return (
    <>
      <Typography variant="h5">
        <span>Hi, {user?.name}!</span>
      </Typography>
      {renderForecast((forecast) => (
        <ForecastTable forecast={forecast} />
      ))}
    </>
  );
};

function App() {
  const classes = useStyles();
  const { isAuthenticated } = useAuth0();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Min-Fin App
            </Typography>
            <LoginLogout color="inherit" />
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main">{isAuthenticated ? <PrivateApp /> : <PublicApp />}</Container>
      <ReportSnackbar />
    </div>
  );
}

export default App;
