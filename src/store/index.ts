import { useSelector } from 'react-redux';
import { RootStore } from './reducers';

export * as Actions from './actions';
export { withStore } from './withStore';
export * from './types';

export const useAuth = () => useSelector((state: RootStore) => state.auth);
export const useForecast = () => useSelector((state: RootStore) => state.demo.forecast);
export const useTransactions = () => useSelector((state: RootStore) => state.demo.trans);
export const useReports = () => useSelector((state: RootStore) => state.reports);
