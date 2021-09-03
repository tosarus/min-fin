import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { withStore } from './store';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="agear.auth0.com"
      clientId="gwQ3yUKWexa7fsvhFzz8Qf3jtAWOcXrY"
      redirectUri={window.location.origin}
      audience="https://recurrent-p/">
      {withStore(App)}
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
