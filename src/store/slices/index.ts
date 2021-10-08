import { createSelector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import accounts from './accounts';
import demo from './demo';
import reports from './reports';
import users from './users';
import workbooks from './workbooks';

export const Actions = {
  ...accounts.actions,
  ...demo.actions,
  ...reports.actions,
  ...users.actions,
  ...workbooks.actions,
};

export const reducer = combineReducers({
  ...accounts.reducer,
  ...demo.reducer,
  ...reports.reducer,
  ...users.reducer,
  ...workbooks.reducer,
});

type Store = ReturnType<typeof reducer>;

const selectors = {
  ...accounts.selectors<Store>(),
  ...demo.selectors<Store>(),
  ...reports.selectors<Store>(),
  ...users.selectors<Store>(),
  ...workbooks.selectors<Store>(),
};

const activeWorkbook = createSelector(selectors.workbooks, selectors.profile, (workbooks, profile) =>
  workbooks?.find((b) => b.id === profile?.active_workbook)
);

export const Selectors = { ...selectors, activeWorkbook };

export const rootSaga = function* () {
  yield all([accounts.saga, demo.saga, reports.saga, users.saga, workbooks.saga].map((s) => fork(s)));
};
