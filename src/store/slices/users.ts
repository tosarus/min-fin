import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { UsersClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { UserInfo } from '../../types';

function cmpUsers(a: UserInfo, b: UserInfo) {
  return a.email < b.email ? -1 : a.email > b.email ? 1 : 0;
}

const {
  name,
  actions: { loadUserListDone, updateUserDone },
  reducer: usersReducer,
} = createSlice({
  name: 'users',
  initialState: [] as UserInfo[],
  reducers: {
    loadUserListDone(state, action: PayloadAction<UserInfo[]>) {
      return [...action.payload].sort(cmpUsers);
    },
    updateUserDone(state, action: PayloadAction<UserInfo>) {
      return [...state.filter((user) => user.email !== action.payload.email), action.payload].sort(cmpUsers);
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
    [loadUserListDone.type]: (state, action: PayloadAction<UserInfo[]>) => {
      const profile = action.payload.find((user) => user.email === state?.email);
      return profile ? { ...profile } : state;
    },
    [updateUserDone.type]: (state, action: PayloadAction<UserInfo>) => {
      if (action.payload.email === state?.email) {
        return { ...action.payload };
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
