import { combineReducers } from 'redux';
import * as actions from './actions';
import auth from './auth';
import budgets from './budgets';
import demo from './demo';
import reports from './reports';
import users from './users';

export const Actions = {
  ...actions,
  ...budgets.actions,
  ...demo.actions,
  ...reports.actions,
  ...users.actions,
};

export const Sagas = {
  ...demo.sagas,
  ...budgets.sagas,
  ...reports.sagas,
  ...users.sagas,
};

export const rootReducer = combineReducers({
  ...auth.reducer,
  ...budgets.reducer,
  ...demo.reducer,
  ...reports.reducer,
  ...users.reducer,
});

type RootStore = ReturnType<typeof rootReducer>;

export const Selectors = {
  ...auth.selectors<RootStore>(),
  ...budgets.selectors<RootStore>(),
  ...demo.selectors<RootStore>(),
  ...reports.selectors<RootStore>(),
  ...users.selectors<RootStore>(),
};
