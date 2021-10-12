import React from 'react';
import { Provider } from 'react-redux';
import { useAuth } from '../auth';
import { createStore } from './createStore';

const StoreApp = ({ children }: { children: React.ReactNode }) => {
  const { auth, _world } = useAuth();
  const { removedTrans: ignored, ...world } = _world ?? { removedTrans: [] };
  const store = createStore(/*context*/ { auth }, /*preloadedState*/ { ...world });
  return <Provider store={store}>{children}</Provider>;
};

export const withStore = (node: React.ReactNode): React.ReactNode => <StoreApp>{node}</StoreApp>;
