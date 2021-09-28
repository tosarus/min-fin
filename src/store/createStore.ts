import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
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
