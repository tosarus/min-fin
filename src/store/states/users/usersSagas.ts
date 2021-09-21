import { takeLatest } from 'redux-saga/effects';
import * as Actions from './usersActions';
import { UsersClient } from './usersClient';
import { sagaWithAuth } from '../sagas';

export function* loadUserListSaga() {
  yield takeLatest(Actions.LOAD_USER_LIST, function* () {
    yield sagaWithAuth(Actions.loadUserListDone, 'Loading user list', [UsersClient, UsersClient.prototype.list]);
  });
}

export function* updateUserSaga() {
  yield takeLatest(Actions.UPDATE_USER, function* ({ user }: ReturnType<typeof Actions.updateUser>) {
    yield sagaWithAuth(Actions.updateUserDone, 'Updating user', [UsersClient, UsersClient.prototype.update], user);
  });
}
