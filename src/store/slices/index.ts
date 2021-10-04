import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import demo from './demo';
import reports from './reports';
import users from './users';
import workbooks from './workbooks';

export const Actions = {
  ...demo.actions,
  ...reports.actions,
  ...users.actions,
  ...workbooks.actions,
};

export const reducer = combineReducers({
  ...demo.reducer,
  ...reports.reducer,
  ...users.reducer,
  ...workbooks.reducer,
});

type Store = ReturnType<typeof reducer>;

export const Selectors = {
  ...demo.selectors<Store>(),
  ...reports.selectors<Store>(),
  ...users.selectors<Store>(),
  ...workbooks.selectors<Store>(),
};

export const rootSaga = function* () {
  yield all([demo.saga, reports.saga, users.saga, workbooks.saga].map((s) => fork(s)));
};
