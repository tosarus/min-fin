import { call, put, select, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadForecastDone, loadTransactionsDone, LOAD_FORECAST, LOAD_TRANSACTIONS } from '../actions';
import { DemoClient } from '../api';
import { CsvTrans, WeatherForecast } from '../types';
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

export function* loadWeatherForecastSaga() {
  const auth = Selectors.auth(yield select());
  const client = new DemoClient(auth);

  while (true) {
    yield take(LOAD_FORECAST);
    const forecast: WeatherForecast[] = yield call(runAjaxSaga, 'Loading forecast', [client, client.loadForecast]);
    yield put(loadForecastDone(forecast || []));
  }
}
