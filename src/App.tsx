import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ForecastTable } from './ForecastTable';
import { NotificationsRoot } from './Notifications';
import { Actions, useForecast } from './store';
import { useDispatchedRender } from './useDispatchedRender';
import './App.css';

function App() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const renderForecast = useDispatchedRender(useForecast, Actions.loadWeatherForecast);

  return (
    <>
      <NotificationsRoot />
      <div className="App">
        <>
          {isAuthenticated ? (
            <p>
              <span style={{ marginRight: '10px' }}>Hi, {user?.name}!</span>
              <a
                className="App-link"
                href="/"
                rel="noopener noreferrer"
                onClick={() => logout({ returnTo: window.location.origin, federated: true })}>
                Log Out
              </a>
            </p>
          ) : (
            <p>
              <span style={{ marginRight: '10px' }}>Hi. Please login.</span>
              <a
                className="App-link"
                href="/"
                rel="noopener noreferrer"
                onClick={() => loginWithRedirect({ prompt: 'login' })}>
                Log In
              </a>
            </p>
          )}
        </>
        {renderForecast((forecast) => (
          <ForecastTable forecast={forecast} />
        ))}
      </div>
    </>
  );
}

export default App;
