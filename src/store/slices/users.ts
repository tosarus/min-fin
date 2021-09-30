import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { UsersClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { UserInfo } from '../../types';

const {
  name,
  actions: { loadUserListDone, updateUserDone },
  reducer: usersReducer,
} = createSlice({
  name: 'users',
  initialState: [] as UserInfo[],
  reducers: {
    loadUserListDone(state, { payload: userList }: PayloadAction<UserInfo[]>) {
      return userList;
    },
    updateUserDone(state, { payload: user }: PayloadAction<UserInfo>) {
      const index = state.findIndex((u) => u.email === user.email);
      state[index] = user;
    },
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *loadUserList() {
      yield callPrivate(loadUserListDone, 'Loading user list', (auth) => new UsersClient(auth).list());
    },
    *updateUser({ payload: user }: PayloadAction<Partial<UserInfo>>) {
      yield callPrivate(updateUserDone, 'Updating user', (auth) => new UsersClient(auth).update(user));
    },
  },
  sagaType: SagaType.TakeLatest,
});

const { reducer: profileReducer } = createSlice({
  name: 'profile',
  initialState: null as UserInfo | null,
  reducers: {},
  extraReducers: {
    [loadUserListDone.type]: (state, { payload: userList }: PayloadAction<UserInfo[]>) => {
      const profile = userList.find((user) => user.email === state?.email);
      return profile ? { ...profile } : state;
    },
    [updateUserDone.type]: (state, { payload: user }: PayloadAction<UserInfo>) => {
      if (user.email === state?.email) {
        return { ...user };
      }
    },
  },
});

const reducer = {
  userList: usersReducer,
  profile: profileReducer,
};

function selectors<Store extends { userList: UserInfo[]; profile: UserInfo | null }>() {
  return {
    userList: (store: Store) => store.userList,
    profile: (store: Store) => store.profile,
  };
}

export default {
  actions: { ...actions, updateProfile: actions.updateUser },
  reducer,
  saga,
  selectors,
};
