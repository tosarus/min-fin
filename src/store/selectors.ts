import { RootStore } from './reducers';

export const auth = (state: RootStore) => state.auth;
export const forecast = (state: RootStore) => state.demo.forecast;
export const transactions = (state: RootStore) => state.demo.trans;
export const reports = (state: RootStore) => state.reports;
export const userList = (state: RootStore) => state.users;
