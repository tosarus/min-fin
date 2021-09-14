import { UserInfo } from '../types';

export const LOAD_USER_INFO = '@@userInfo/LOAD_USER_INFO';
export const LOAD_USER_INFO_DONE = '@@userInfo/LOAD_USER_INFO_DONE';

interface LoadUserInfoDoneAction {
  type: typeof LOAD_USER_INFO_DONE;
  userInfo: UserInfo;
}

export type UserInfoActionTypes = LoadUserInfoDoneAction;

export const loadUserInfo = () => ({ type: LOAD_USER_INFO });
export const loadUserInfoDone = (userInfo: UserInfo) => ({ type: LOAD_USER_INFO_DONE, userInfo });
