import * as Actions from './usersActions';
import { ActionsType } from '../actions';
import { UserInfo } from '../types';

const initialState: UserInfo[] = [];

function cmpUsers(a: UserInfo, b: UserInfo) {
  return a.email < b.email ? -1 : a.email > b.email ? 1 : 0;
}

function usersReducer(state = initialState, action: ActionsType<typeof Actions>) {
  if (action.type === Actions.LOAD_USER_LIST_DONE) {
    return [...action.users].sort(cmpUsers);
  }

  if (action.type === Actions.UPDATE_USER_DONE) {
    return [...state.filter((user) => user.email !== action.user.email), action.user].sort(cmpUsers);
  }

  return state;
}

export const reducer = {
  users: usersReducer,
};

export function selectors<Store extends { users: typeof initialState }>() {
  return {
    userList: (store: Store) => store.users,
  };
}
