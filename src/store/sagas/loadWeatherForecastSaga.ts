import { call, put, take } from 'redux-saga/effects';
import { runAjaxSaga } from './runAjaxSaga';
import { loadWeatherForecastDone, LOAD_WEATHER_FORECAST } from '../actions';
import { ForecastClient } from '../api';
import { WeatherForecast } from '../types';

export function* loadWeatherForecastSaga() {
  const client = new ForecastClient();

  while (true) {
    yield take(LOAD_WEATHER_FORECAST);
    const forecast: WeatherForecast[] = yield call(runAjaxSaga, 'Loading weather forecast', [client, client.load]);
    yield put(loadWeatherForecastDone(forecast || []));
  }
}
