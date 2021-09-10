import { combineReducers } from 'redux';
import ajaxStatus from './ajaxStatusReducer';
import auth from './authReducer';
import demo from './demoReducer';
import reports from './reportReducer';

export const rootReducer = combineReducers({
  ajaxStatus,
  auth,
  demo,
  reports,
});

export type RootStore = ReturnType<typeof rootReducer>;
