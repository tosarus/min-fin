import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './configureStore';
import { rootSaga } from './sagas';
import { useAuth } from '../auth';

const StoreApp = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth();
  const store = configureStore({ auth });
  store.runSaga(rootSaga);

  return <Provider store={store}>{children}</Provider>;
};

export const withStore = (node: React.ReactNode): React.ReactNode => <StoreApp>{node}</StoreApp>;
