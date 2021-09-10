import { WeatherForecast, CsvTrans } from '../types';

export const LOAD_FORECAST = '@@demo/LOAD_FORECAST';
export const LOAD_FORECAST_DONE = '@@demo/LOAD_FORECAST_DONE';
export const LOAD_TRANSACTIONS = '@@demo/LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_DONE = '@@demo/LOAD_TRANSACTIONS_DONE';

interface LoadForecastDoneAction {
  type: typeof LOAD_FORECAST_DONE;
  forecast: WeatherForecast[];
}

interface LoadTransactionsDoneAction {
  type: typeof LOAD_TRANSACTIONS_DONE;
  trans: CsvTrans[];
}

export type DemoActionTypes = LoadForecastDoneAction | LoadTransactionsDoneAction;

export const loadForecast = () => ({ type: LOAD_FORECAST });
export const loadForecastDone = (forecast: WeatherForecast[]) => ({ type: LOAD_FORECAST_DONE, forecast });
export const loadTransactions = () => ({ type: LOAD_TRANSACTIONS });
export const loadTransactionsDone = (trans: CsvTrans[]) => ({ type: LOAD_TRANSACTIONS_DONE, trans });
