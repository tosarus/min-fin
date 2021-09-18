import { combineReducers } from 'redux';
import * as actions from './actions';
import auth from './auth';
import demo from './demo';
import reports from './reports';
import users from './users';

export const Actions = {
  ...actions,
  ...demo.actions,
  ...reports.actions,
  ...users.actions,
};

export const Sagas = {
  ...demo.sagas,
  ...reports.sagas,
  ...users.sagas,
};

export const rootReducer = combineReducers({
  ...auth.reducer,
  ...demo.reducer,
  ...reports.reducer,
  ...users.reducer,
});

type RootStore = ReturnType<typeof rootReducer>;

export const Selectors = {
  ...auth.selectors<RootStore>(),
  ...demo.selectors<RootStore>(),
  ...reports.selectors<RootStore>(),
  ...users.selectors<RootStore>(),
};
