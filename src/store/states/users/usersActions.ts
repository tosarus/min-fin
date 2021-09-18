import { UserInfo } from '../types';

export const LOAD_USER_LIST = '@@users/LOAD_USERS';
export const LOAD_USER_LIST_DONE = '@@users/LOAD_USER_LIST_DONE';
export const UPDATE_USER = '@@users/UPDATE_USER';
export const UPDATE_USER_DONE = '@@users/UPDATE_USER_DONE';

export const loadUserList = () => ({ type: LOAD_USER_LIST } as const);
export const loadUserListDone = (users: UserInfo[]) => ({ type: LOAD_USER_LIST_DONE, users } as const);
export const updateUser = (user: Partial<UserInfo>) => ({ type: UPDATE_USER, user } as const);
export const updateUserDone = (user: UserInfo) => ({ type: UPDATE_USER_DONE, user } as const);
