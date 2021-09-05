import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { withStore } from './store';
import { withStyle } from './styling';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="agear.auth0.com"
      clientId="gwQ3yUKWexa7fsvhFzz8Qf3jtAWOcXrY"
      redirectUri={window.location.origin}
      audience="https://recurrent-p/">
      {withStore(withStyle(<App />))}
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
