import { put, call, select } from 'redux-saga/effects';
import { Selectors } from '..';
import { Auth } from '../../auth';
import { reportError } from '../actions';

export function* saga<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
  action: (param: any) => any,
  message: string,
  ctorAndFn: [new () => Ctx, Fn],
  ...args: Parameters<Fn>
): any {
  try {
    const ctx = new ctorAndFn[0]();
    const retVal = yield call([ctx, ctorAndFn[1]], ...(args as Parameters<Fn>));
    yield put(action(retVal));
  } catch (error) {
    yield put(reportError(`${message}: ${error}`, 5000));
  }
}

export function* sagaWithAuth<Ctx, Fn extends (this: Ctx, ...args: any[]) => any>(
  action: (param: any) => any,
  message: string,
  ctorAndFn: [new (auth: Auth) => Ctx, Fn],
  ...args: Parameters<Fn>
): any {
  const auth = Selectors.auth(yield select());
  const ctx = new ctorAndFn[0](auth);
  try {
    const retVal = yield call([ctx, ctorAndFn[1]], ...(args as Parameters<Fn>));
    yield put(action(retVal));
  } catch (error) {
    yield put(reportError(`${message}: ${error}`, 5000));
  }
}
