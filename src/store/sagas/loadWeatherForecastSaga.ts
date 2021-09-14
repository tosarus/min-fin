import { call, put, select, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadForecastDone, LOAD_FORECAST } from '../actions';
import { DemoClient } from '../api';
import { WeatherForecast } from '../types';
import { Selectors } from '..';

export function* loadWeatherForecastSaga() {
  const auth = Selectors.auth(yield select());
  const client = new DemoClient(auth);

  while (true) {
    yield take(LOAD_FORECAST);
    const forecast: WeatherForecast[] = yield call(runAjaxSaga, 'Loading forecast', [client, client.loadForecast]);
    yield put(loadForecastDone(forecast || []));
  }
}
