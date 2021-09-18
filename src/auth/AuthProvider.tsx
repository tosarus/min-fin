import React, { useEffect, useReducer, useState } from 'react';
import { Auth0ClientOptions } from '@auth0/auth0-spa-js';
import { Auth } from './Auth';
import { authDone, authError, initialState, reducer } from './AuthState';
import { hasAuthParams } from './utils';
import { UserClient } from '../clients';

const AuthContext = React.createContext({ auth: new Auth(), ...initialState });
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
  const [state, dispatch] = useReducer(reducer, initialState);

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
      dispatch(authDone(user));
    };
    authenticate().catch((error: Error) => dispatch(authError(error)));
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
