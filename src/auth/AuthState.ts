import { UserInfo } from '../store';

interface AuthState {
  error?: Error;
  isAuthenticated: boolean;
  isReady: boolean;
  user?: UserInfo;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isReady: false,
};

export const AUTH_DONE = '@@auth/AUTH_DONE';
export const AUTH_ERROR = '@@auth/AUTH_ERROR';

type Actions = { type: typeof AUTH_DONE; user?: UserInfo } | { type: typeof AUTH_ERROR; error: Error };

export const stateReducer = (state: AuthState, action: Actions): AuthState => {
  switch (action.type) {
    case AUTH_DONE: {
      const { user } = action;
      return { ...state, isReady: true, user, isAuthenticated: !!user };
    }
    case AUTH_ERROR: {
      const { error } = action;
      return { ...state, isReady: true, error };
    }
  }
};
