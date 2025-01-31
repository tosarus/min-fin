import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo, WorldUpdate } from '../../types';
import { UsersClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { applyWorldUpdate } from './actions';

const {
  name,
  actions: { loadUserListDone },
  reducer: usersReducer,
} = createSlice({
  name: 'users',
  initialState: [] as UserInfo[],
  reducers: {
    loadUserListDone(state, { payload: userList }: PayloadAction<UserInfo[]>) {
      return userList;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyWorldUpdate.type, (state, { payload: { profile } }: PayloadAction<WorldUpdate>) => {
      if (profile) {
        const index = state.findIndex((u) => u.email === profile.email);
        if (index > -1) {
          state.splice(index, 1, profile);
        }
      }
    });
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *loadUserList() {
      yield callPrivate(loadUserListDone, 'Loading user list', (auth) => new UsersClient(auth).list());
    },
    *updateUser({ payload: user }: PayloadAction<Partial<UserInfo>>) {
      yield callPrivate(applyWorldUpdate, 'Updating user', (auth) => new UsersClient(auth).update(user));
    },
  },
  sagaType: SagaType.TakeLatest,
});

const { reducer: profileReducer } = createSlice({
  name: 'profile',
  initialState: null as UserInfo | null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUserListDone.type as string, (state, { payload: userList }: PayloadAction<UserInfo[]>) => {
      const profile = userList.find((user) => user.email === state?.email);
      return profile ? { ...profile } : state;
    });
    builder.addCase(applyWorldUpdate.type, (state, { payload: { profile } }: PayloadAction<WorldUpdate>) => {
      if (profile && (!state || state.email === profile.email)) {
        return { ...profile };
      }
    });
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
