import { put, call, getContext } from 'redux-saga/effects';
import { Actions } from './slices';
import { Auth } from '../auth';

export function* callPublic(action: (param: any) => any, message: string, caller: () => any): any {
  try {
    const retVal = yield call(caller);
    yield put(action(retVal));
  } catch (error) {
    yield put(Actions.reportError({ text: `${message}: ${error}`, timeOut: 5000 }));
  }
}

export function* callPrivate(action: (param: any) => any, message: string, caller: (auth: Auth) => any): any {
  const auth = yield getContext('auth');
  try {
    const retVal = yield call(caller, auth);
    yield put(action(retVal));
  } catch (error) {
    yield put(Actions.reportError({ text: `${message}: ${error}`, timeOut: 5000 }));
  }
}