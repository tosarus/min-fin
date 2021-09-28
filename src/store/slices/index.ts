import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import budgets from './budgets';
import demo from './demo';
import reports from './reports';
import users from './users';

export const Actions = {
  ...budgets.actions,
  ...demo.actions,
  ...reports.actions,
  ...users.actions,
};

export const reducer = combineReducers({
  ...budgets.reducer,
  ...demo.reducer,
  ...reports.reducer,
  ...users.reducer,
});

type Store = ReturnType<typeof reducer>;

export const Selectors = {
  ...budgets.selectors<Store>(),
  ...demo.selectors<Store>(),
  ...reports.selectors<Store>(),
  ...users.selectors<Store>(),
};

export const rootSaga = function* () {
  yield all([demo.saga, budgets.saga, reports.saga, users.saga].map((s) => fork(s)));
};
