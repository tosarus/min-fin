import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import { createSelector } from '@reduxjs/toolkit';
import accounts from './accounts';
import demo from './demo';
import reports from './reports';
import transactions from './transactions';
import users from './users';
import workbooks from './workbooks';

export const Actions = {
  ...accounts.actions,
  ...demo.actions,
  ...reports.actions,
  ...transactions.actions,
  ...users.actions,
  ...workbooks.actions,
};

export const reducer = combineReducers({
  ...accounts.reducer,
  ...demo.reducer,
  ...reports.reducer,
  ...transactions.reducer,
  ...users.reducer,
  ...workbooks.reducer,
});

type Store = ReturnType<typeof reducer>;

const selectors = {
  ...accounts.selectors<Store>(),
  ...demo.selectors<Store>(),
  ...reports.selectors<Store>(),
  ...transactions.selectors<Store>(),
  ...users.selectors<Store>(),
  ...workbooks.selectors<Store>(),
};

const activeWorkbook = createSelector(selectors.workbooks, selectors.profile, (workbooks, profile) =>
  workbooks?.find((wb) => wb.id === profile?.active_workbook)
);

const currentAccounts = createSelector(activeWorkbook, selectors.accounts, (activeWb, accounts) =>
  accounts?.filter((acc) => acc.workbook_id === activeWb?.id)
);

export const Selectors = { ...selectors, activeWorkbook, currentAccounts };

export const rootSaga = function* () {
  yield all([accounts.saga, demo.saga, reports.saga, transactions.saga, users.saga, workbooks.saga].map((s) => fork(s)));
};
