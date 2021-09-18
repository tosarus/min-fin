import { takeLatest } from 'redux-saga/effects';
import * as Actions from './usersActions';
import { UserClient } from '../clients';
import { sagaWithAuth } from '../sagas';

export function* loadUserListSaga() {
  yield takeLatest(Actions.LOAD_USER_LIST, function* () {
    yield sagaWithAuth(Actions.loadUserListDone, 'Loading user list', [UserClient, UserClient.prototype.list]);
  });
}

export function* updateUserSaga() {
  yield takeLatest(Actions.UPDATE_USER, function* ({ user }: any) {
    yield sagaWithAuth(Actions.updateUserDone, 'Updating user', [UserClient, UserClient.prototype.update], user);
  });
}
