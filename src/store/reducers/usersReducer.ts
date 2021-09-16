import ActionsType from './actionsType';
import { LOAD_USER_LIST_DONE, UPDATE_USER_DONE } from '../actions';
import { UserInfo } from '../types';

const initialState: UserInfo[] = [];

export default function usersReducer(state = initialState, action: ActionsType) {
  if (action.type === LOAD_USER_LIST_DONE) {
    return [...action.users];
  }

  if (action.type === UPDATE_USER_DONE) {
    return [...state.filter((user) => user.email !== action.user.email), action.user];
  }

  return state;
}
