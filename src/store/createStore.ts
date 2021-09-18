import { createStore as createReduxStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { rootReducer, Actions, Sagas } from './states';

const rootSaga = function* () {
  const sagasArr = Object.values(Sagas);
  yield all(sagasArr.map((s) => fork(s)));
};

export function createStore(additionalState?: Partial<ReturnType<typeof rootReducer>>) {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const initialState = rootReducer(undefined, Actions.getInitialState());
  const store = createReduxStore(rootReducer, { ...initialState, ...additionalState }, applyMiddleware(...middlewares));
  sagaMiddleware.run(rootSaga);
  return store;
}
