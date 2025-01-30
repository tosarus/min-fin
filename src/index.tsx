import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, config } from './auth';
import { App } from './layouts';
import { withStore } from './store';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider {...config} redirect_uri={window.location.origin}>
      {withStore(<App />)}
    </AuthProvider>
  </React.StrictMode>
);
