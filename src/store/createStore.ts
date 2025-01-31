import createSagaMiddleware from 'redux-saga';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { reducer, rootSaga } from './slices';

export function createStore<C extends Record<string, unknown>>(
  context?: C,
  preloadedState?: Partial<ReturnType<typeof reducer>>
) {
  const sagaMiddleware = createSagaMiddleware({ context });
  const middlewares = [] as Middleware[];
  middlewares.push(sagaMiddleware);
  const store = configureStore({
    reducer,
    middleware: (getDefault) => getDefault({ thunk: false }).concat(middlewares),
    preloadedState,
  });
  sagaMiddleware.run(rootSaga);
  return store;
}
