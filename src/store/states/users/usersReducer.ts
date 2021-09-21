import * as Actions from './usersActions';
import { ActionsType } from '../actions';
import { UserInfo } from '../types';

const initialUsersState: UserInfo[] = [];

function cmpUsers(a: UserInfo, b: UserInfo) {
  return a.email < b.email ? -1 : a.email > b.email ? 1 : 0;
}

function usersReducer(state = initialUsersState, action: ActionsType<typeof Actions>) {
  if (action.type === Actions.LOAD_USER_LIST_DONE) {
    return [...action.users].sort(cmpUsers);
  }

  if (action.type === Actions.UPDATE_USER_DONE) {
    return [...state.filter((user) => user.email !== action.user.email), action.user].sort(cmpUsers);
  }

  return state;
}

const initialProfileState: UserInfo | null = null;

function profileReducer(state = initialProfileState, action: ActionsType<typeof Actions>) {
  if (action.type === Actions.LOAD_USER_LIST_DONE) {
    const profile = action.users.find((user) => user.email === state?.email);
    return profile ? { ...profile } : state;
  }

  if (action.type === Actions.UPDATE_USER_DONE) {
    if (action.user.email === state?.email) {
      return { ...action.user };
    }
  }

  return state;
}

export const reducer = {
  userList: usersReducer,
  profile: profileReducer,
};

export function selectors<Store extends { userList: typeof initialUsersState; profile: typeof initialProfileState }>() {
  return {
    userList: (store: Store) => store.userList,
    profile: (store: Store) => store.profile,
  };
}
