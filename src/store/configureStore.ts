import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, RootStore } from './reducers';

export function configureStore(initialState: RootStore) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  return {
    ...createStore(rootReducer, initialState, applyMiddleware(...middlewares)),
    runSaga: sagaMiddleware.run,
  };
}
