import { call, put, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadForecastDone, LOAD_FORECAST } from '../actions';
import { DemoClient } from '../api';
import { WeatherForecast } from '../types';

export function* loadWeatherForecastSaga() {
  const client = new DemoClient();

  while (true) {
    yield take(LOAD_FORECAST);
    const forecast: WeatherForecast[] = yield call(runAjaxSaga, 'Loading forecast', [client, client.loadForecast]);
    yield put(loadForecastDone(forecast || []));
  }
}
