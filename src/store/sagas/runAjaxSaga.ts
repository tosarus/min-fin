import { put, call } from 'redux-saga/effects';
import { beginAjaxCall, stopAjaxCall, reportError } from '../actions';

export function* runAjaxSaga<Ctx, Fn extends (this: Ctx, ...args: any[]) => any, Fn2 extends (...args: any[]) => any>(
  message: string,
  ctxAndFn: [Ctx, Fn] | Fn2,
  ...args: Parameters<Fn> | Parameters<Fn2>
): any {
  yield put(beginAjaxCall(message));
  try {
    if (Array.isArray(ctxAndFn)) {
      return yield call(ctxAndFn, ...(args as Parameters<Fn>));
    } else {
      return yield call(ctxAndFn, ...(args as Parameters<Fn2>));
    }
  } catch (error) {
    yield put(reportError((error as any).toString(), 5000));
  } finally {
    yield put(stopAjaxCall(message));
  }
}
