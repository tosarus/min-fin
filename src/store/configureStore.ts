import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, initialState } from './reducers';

export function configureStore(additionalState?: Partial<typeof initialState>) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  return {
    ...createStore(rootReducer, { ...initialState, ...additionalState }, applyMiddleware(...middlewares)),
    runSaga: sagaMiddleware.run,
  };
}
