import { WeatherForecast } from '../types';

export const LOAD_WEATHER_FORECAST = 'LOAD_WEATHER_FORECAST';
export const LOAD_WEATHER_FORECAST_DONE = 'LOAD_WEATHER_FORECAST_DONE';

interface LoadWeatherForecastDoneAction {
  type: typeof LOAD_WEATHER_FORECAST_DONE;
  forecast: WeatherForecast[];
}

export type WeatherForecastActionTypes = LoadWeatherForecastDoneAction;

export const loadWeatherForecast = () => ({ type: LOAD_WEATHER_FORECAST });
export const loadWeatherForecastDone = (forecast: WeatherForecast[]) => ({
  type: LOAD_WEATHER_FORECAST_DONE,
  forecast,
});
