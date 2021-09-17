import { UserInfo } from '../store';

interface AuthState {
  error?: Error;
  isAuthenticated: boolean;
  isReady: boolean;
  user?: UserInfo;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  isReady: false,
};

const AUTH_DONE = '@@auth/AUTH_DONE';
const AUTH_ERROR = '@@auth/AUTH_ERROR';

export const authDone = (user?: UserInfo) => ({ type: AUTH_DONE, user } as const);
export const authError = (error: Error) => ({ type: AUTH_ERROR, error } as const);

type Actions = ReturnType<typeof authDone> | ReturnType<typeof authError>;

export const reducer = (state: AuthState, action: Actions): AuthState => {
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
