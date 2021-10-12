import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { reducer, rootSaga } from './slices';

export function createStore<C extends Record<string, unknown>>(
  context?: C,
  preloadedState?: Partial<ReturnType<typeof reducer>>
) {
  const sagaMiddleware = createSagaMiddleware({ context });
  const loggerMiddleware = createLogger({ duration: true });
  const store = configureStore({
    reducer,
    middleware: (getDefault) => getDefault({ thunk: false }).concat([sagaMiddleware, loggerMiddleware]),
    preloadedState,
  });
  sagaMiddleware.run(rootSaga);
  return store;
}
