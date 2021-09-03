import { useSelector } from 'react-redux';
import * as Actions from './actions';
import * as Selectors from './selectors';
import { withStore } from './withStore';

export { Actions, withStore };

export const useAuth = () => useSelector(Selectors.getAuth);
export const useForecast = () => useSelector(Selectors.getForecast);
export const useReports = () => useSelector(Selectors.getReports);
