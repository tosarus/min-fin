import { RootStore } from './reducers';

export const getAuth = (state: RootStore) => state.auth;
export const getForecast = (state: RootStore) => state.forecast;
export const getReports = (state: RootStore) => state.reports;
