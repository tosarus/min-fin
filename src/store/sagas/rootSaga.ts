import { all, fork } from 'redux-saga/effects';
import * as sagas from './sagas';

export const rootSaga = function* root() {
  const sagasArr = Object.values(sagas);
  yield all(sagasArr.map(s => fork(s)));
};
