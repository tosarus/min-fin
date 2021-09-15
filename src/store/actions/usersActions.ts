import { UserInfo } from '../types';

export const LOAD_USER_LIST = '@@users/LOAD_USERS';
export const LOAD_USER_LIST_DONE = '@@users/LOAD_USER_LIST_DONE';
export const UPDATE_USER = '@@users/UPDATE_USER';
export const UPDATE_USER_DONE = '@@users/UPDATE_USER_DONE';

interface LoadUserListDoneAction {
  type: typeof LOAD_USER_LIST_DONE;
  users: UserInfo[];
}

interface UpdateUserDoneAction {
  type: typeof UPDATE_USER_DONE;
  user: UserInfo;
}

export type UsersActions = LoadUserListDoneAction | UpdateUserDoneAction;

export const loadUserList = () => ({ type: LOAD_USER_LIST });
export const loadUserListDone = (users: UserInfo[]) => ({ type: LOAD_USER_LIST_DONE, users });
export const updateUser = (user: Partial<UserInfo>) => ({ type: UPDATE_USER, user });
export const updateUserDone = (user: UserInfo) => ({ type: UPDATE_USER_DONE, user });
