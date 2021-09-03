import { WeatherForecastActionTypes, LOAD_WEATHER_FORECAST_DONE } from '../actions';
import { WeatherForecast } from '../types';

const initialState: WeatherForecast[] | null = null;

export default function forecastReducer(state = initialState, action: WeatherForecastActionTypes) {
  if (action.type === LOAD_WEATHER_FORECAST_DONE) {
    return [...action.forecast];
  }

  return state;
}
