import { AnyAction } from 'redux';
import { Auth } from '../types';

const initialState = new Auth();

function authReducer(state = initialState, action: AnyAction) {
  action;
  return state;
}

export const reducer = {
  auth: authReducer,
};

export function selectors<Store extends { auth: typeof initialState }>() {
  return { auth: (store: Store) => store.auth };
}
