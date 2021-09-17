import { takeLatest } from 'redux-saga/effects';
import { loadForecastDone, loadTransactionsDone, LOAD_FORECAST, LOAD_TRANSACTIONS } from '../actions';
import { ForecastClient, TransClient } from '../api';
import { saga, sagaWithAuth } from './sagaHelper';

export function* loadTransactionsSaga() {
  yield takeLatest(LOAD_TRANSACTIONS, function* () {
    yield sagaWithAuth(loadTransactionsDone, 'Loading transactions', [TransClient, TransClient.prototype.load]);
  });
}

export function* loadWeatherForecastSaga() {
  yield takeLatest(LOAD_FORECAST, function* () {
    yield saga(loadForecastDone, 'Loading forecast', [ForecastClient, ForecastClient.prototype.load]);
  });
}
