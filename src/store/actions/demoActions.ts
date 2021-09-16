import { WeatherForecast, CsvTrans } from '../types';

export const LOAD_FORECAST = '@@demo/LOAD_FORECAST';
export const LOAD_FORECAST_DONE = '@@demo/LOAD_FORECAST_DONE';
export const LOAD_TRANSACTIONS = '@@demo/LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_DONE = '@@demo/LOAD_TRANSACTIONS_DONE';

export const loadForecast = () => ({ type: LOAD_FORECAST } as const);
export const loadForecastDone = (forecast: WeatherForecast[]) => ({ type: LOAD_FORECAST_DONE, forecast } as const);
export const loadTransactions = () => ({ type: LOAD_TRANSACTIONS } as const);
export const loadTransactionsDone = (trans: CsvTrans[]) => ({ type: LOAD_TRANSACTIONS_DONE, trans } as const);
