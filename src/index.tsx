import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider, config } from './auth';
import { App } from './views';
import { withStore } from './store';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider {...config} redirect_uri={window.location.origin}>
      {withStore(<App />)}
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
