import { call, put, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadTransactionsDone, LOAD_TRANSACTIONS } from '../actions';
import { DemoClient } from '../api';
import { CsvTrans } from '../types';

export function* loadTransactionsSaga() {
  const client = new DemoClient();

  while (true) {
    yield take(LOAD_TRANSACTIONS);
    const trans: CsvTrans[] = yield call(runAjaxSaga, 'Loading transactions', [client, client.loadTransactions]);
    yield put(loadTransactionsDone(trans));
  }
}
