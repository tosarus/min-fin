import { AnyAction } from 'redux';
import { Auth } from '../../auth/Auth';

const initialState = new Auth();

export default function authReducer(state = initialState, action: AnyAction) {
  action;
  return state;
}
