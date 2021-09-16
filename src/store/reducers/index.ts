import { combineReducers } from 'redux';
import ajaxStatus from './ajaxStatusReducer';
import auth from './authReducer';
import demo from './demoReducer';
import reports from './reportsReducer';
import users from './usersReducer';

export const rootReducer = combineReducers({
  ajaxStatus,
  auth,
  demo,
  reports,
  users,
});

export type RootStore = ReturnType<typeof rootReducer>;
