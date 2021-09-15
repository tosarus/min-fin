import { call, put, select, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadUserListDone, LOAD_USER_LIST, updateUserDone, UPDATE_USER } from '../actions';
import { UserClient } from '../api';
import { UserInfo } from '../types';
import { Selectors } from '..';

export function* loadUserListSaga() {
  const auth = Selectors.auth(yield select());
  const client = new UserClient(auth);

  while (true) {
    yield take(LOAD_USER_LIST);
    const users: UserInfo[] = yield call(runAjaxSaga, 'Loading user list', [client, client.list]);
    yield put(loadUserListDone(users));
  }
}

export function* updateUserSaga() {
  const auth = Selectors.auth(yield select());
  const client = new UserClient(auth);

  while (true) {
    const { user } = yield take(UPDATE_USER);
    const updatedUser: UserInfo = yield call(runAjaxSaga, 'Updating user', [client, client.update], user);
    yield put(updateUserDone(updatedUser));
  }
}
