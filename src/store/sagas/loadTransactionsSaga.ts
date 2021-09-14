import { call, put, select, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadTransactionsDone, LOAD_TRANSACTIONS } from '../actions';
import { DemoClient } from '../api';
import { CsvTrans } from '../types';
import { Selectors } from '..';

export function* loadTransactionsSaga() {
  const auth = Selectors.auth(yield select());
  const client = new DemoClient(auth);

  while (true) {
    yield take(LOAD_TRANSACTIONS);
    const trans: CsvTrans[] = yield call(runAjaxSaga, 'Loading transactions', [client, client.loadTransactions]);
    yield put(loadTransactionsDone(trans));
  }
}
