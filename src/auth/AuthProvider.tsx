import React, { useEffect, useReducer, useState } from 'react';
import { UsersClient } from '../store';
import { Auth, AuthOptions } from './Auth';
import { authDone, authError, initialState, reducer } from './AuthState';
import { hasAuthParams } from './utils';

const AuthContext = React.createContext({ auth: new Auth(), ...initialState });
export const useAuth = () => React.useContext(AuthContext);

interface AuthProviderProps extends AuthOptions {
  children: React.ReactNode;
  onRedirectCallback?: (returnUrl?: string) => void;
}

const defaultOnRedirectCallback = (returnUrl?: string): void => {
  window.history.replaceState({}, document.title, returnUrl || window.location.pathname);
};

export const AuthProvider = ({ children, onRedirectCallback = defaultOnRedirectCallback, ...opts }: AuthProviderProps) => {
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
      let world;
      if (await auth.isAuthenticated()) {
        world = await new UsersClient(auth).authenticate();
      }
      dispatch(authDone(world));
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
