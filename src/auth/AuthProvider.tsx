import React, { useEffect, useReducer, useState } from 'react';
import { Auth0ClientOptions } from '@auth0/auth0-spa-js';
import { Auth } from './Auth';
import { AUTH_DONE, AUTH_ERROR, initialAuthState, stateReducer } from './AuthState';
import { hasAuthParams } from './utils';
import { UserClient } from '../store';

const AuthContext = React.createContext({ auth: new Auth(), ...initialAuthState });
export const useAuth = () => React.useContext(AuthContext);

interface AuthProviderProps extends Auth0ClientOptions {
  children: React.ReactNode;
  onRedirectCallback?: (returnUrl?: string) => void;
}

const defaultOnRedirectCallback = (returnUrl?: string): void => {
  window.history.replaceState({}, document.title, returnUrl || window.location.pathname);
};

export const AuthProvider = ({
  children,
  onRedirectCallback = defaultOnRedirectCallback,
  ...opts
}: AuthProviderProps) => {
  const [auth] = useState(() => new Auth(opts));
  const [state, dispatch] = useReducer(stateReducer, initialAuthState);

  useEffect(() => {
    const authenticate = async (): Promise<void> => {
      if (hasAuthParams()) {
        const { appState } = await auth.handleRedirect();
        onRedirectCallback(appState?.returnTo);
      } else {
        await auth.checkSession();
      }
      let user;
      if (await auth.isAuthenticated()) {
        user = await new UserClient(auth).getUserInfo();
      }
      dispatch({ type: AUTH_DONE, user });
    };
    authenticate().catch((error: Error) => dispatch({ type: AUTH_ERROR, error }));
  }, [auth, dispatch, onRedirectCallback]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        ...state,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
