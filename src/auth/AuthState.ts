import { WorldUpdate } from '../types';

interface AuthState {
  error?: Error;
  isAuthenticated: boolean;
  isReady: boolean;
  _world?: WorldUpdate;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  isReady: false,
};

const AUTH_DONE = '@@auth/AUTH_DONE';
const AUTH_ERROR = '@@auth/AUTH_ERROR';

export const authDone = (world?: WorldUpdate) => ({ type: AUTH_DONE, world }) as const;
export const authError = (error: Error) => ({ type: AUTH_ERROR, error }) as const;

type Actions = ReturnType<typeof authDone> | ReturnType<typeof authError>;

export const reducer = (state: AuthState, action: Actions): AuthState => {
  switch (action.type) {
    case AUTH_DONE: {
      const { world } = action;
      return { ...state, isReady: true, _world: world, isAuthenticated: !!world };
    }
    case AUTH_ERROR: {
      const { error } = action;
      return { ...state, isReady: true, error };
    }
  }
};
