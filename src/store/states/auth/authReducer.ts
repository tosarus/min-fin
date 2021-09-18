import { AnyAction } from 'redux';
import { Auth } from '../types';

const initialState = new Auth();

function userReducer(state = initialState, action: AnyAction) {
  action;
  return state;
}

export const reducer = {
  auth: userReducer,
};

export function selectors<Store extends { auth: typeof initialState }>() {
  return { auth: (store: Store) => store.auth };
}
