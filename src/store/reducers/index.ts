import { combineReducers } from 'redux';
import auth from './authReducer';
import demo from './demoReducer';
import reports from './reportsReducer';
import users from './usersReducer';
import { getInitialState } from '../actions';

export const rootReducer = combineReducers({
  auth,
  demo,
  reports,
  users,
});

export const initialState = {
  auth: auth(undefined, getInitialState()),
  demo: demo(undefined, getInitialState()),
  reports: reports(undefined, getInitialState()),
  users: users(undefined, getInitialState()),
};

export type RootStore = ReturnType<typeof rootReducer>;
