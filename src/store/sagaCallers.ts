import { put, call, getContext } from 'redux-saga/effects';
import { Auth } from '../auth';
import { Actions } from './slices';

export function* callPublic(action: (param: any) => any, message: string, caller: () => any): any {
  yield put(Actions.beginAjaxCall(message));
  try {
    const retVal = yield call(caller);
    yield put(action(retVal));
  } catch (error) {
    yield put(Actions.reportError(`${message}: ${error}`, 5000));
  } finally {
    yield put(Actions.stopAjaxCall(message));
  }
}

export function* callPrivate(action: (param: any) => any, message: string, caller: (auth: Auth) => any): any {
  yield put(Actions.beginAjaxCall(message));
  try {
    const auth = yield getContext('auth');
    const retVal = yield call(caller, auth);
    yield put(action(retVal));
  } catch (error) {
    yield put(Actions.reportError(`${message}: ${error}`, 5000));
  } finally {
    yield put(Actions.stopAjaxCall(message));
  }
}
