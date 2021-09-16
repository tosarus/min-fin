import ActionsType from './actionsType';
import { Auth } from '../../auth/Auth';

const initialState = new Auth();

export default function authReducer(state = initialState, action: ActionsType) {
  action;
  return state;
}
