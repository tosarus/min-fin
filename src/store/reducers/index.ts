import { combineReducers } from 'redux';
import ajaxStatus from './ajaxStatusReducer';
import auth from './authReducer';
import forecast from './forecastReducer';
import reports from './reportReducer';

export const rootReducer = combineReducers({
  ajaxStatus,
  auth,
  forecast,
  reports,
});

export type RootStore = ReturnType<typeof rootReducer>;
