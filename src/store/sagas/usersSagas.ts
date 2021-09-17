import { takeLatest } from 'redux-saga/effects';
import { loadUserListDone, LOAD_USER_LIST, updateUserDone, UPDATE_USER } from '../actions';
import { UserClient } from '../api';
import { sagaWithAuth } from './sagaHelper';

export function* loadUserListSaga() {
  yield takeLatest(LOAD_USER_LIST, function* () {
    yield sagaWithAuth(loadUserListDone, 'Loading user list', [UserClient, UserClient.prototype.list]);
  });
}

export function* updateUserSaga() {
  yield takeLatest(UPDATE_USER, function* ({ user }: any) {
    yield sagaWithAuth(updateUserDone, 'Updating user', [UserClient, UserClient.prototype.update], user);
  });
}
