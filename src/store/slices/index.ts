import { combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import accounts from './accounts';
import demo from './demo';
import reports from './reports';
import transactions from './transactions';
import users from './users';
import workbooks from './workbooks';

const slices = { accounts, demo, reports, transactions, users, workbooks };

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never;
const intersect = <T>(t: T) => t as UnionToIntersection<T>;

export const Actions = intersect(
  Object.values(slices)
    .map(({ actions }) => actions)
    .reduce((r, t) => ({ ...r, ...t }))
);

export const reducer = combineReducers(
  intersect(
    Object.values(slices)
      .map(({ reducer }) => reducer)
      .reduce((r, t) => ({ ...r, ...t }))
  )
);

export const Selectors = intersect(
  Object.values(slices)
    .map(({ selectors }) => (selectors as any)() as ReturnType<typeof selectors>)
    .reduce((s, t) => ({ ...s, ...t }))
);

export const rootSaga = function* () {
  const sagas = Object.values(slices).map(({ saga }) => saga);
  yield all(sagas.map((s) => fork(s)));
};
