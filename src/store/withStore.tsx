import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from './createStore';
import { useAuth } from '../auth';

const StoreApp = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth();
  const store = createStore({ auth });
  return <Provider store={store}>{children}</Provider>;
};

export const withStore = (node: React.ReactNode): React.ReactNode => <StoreApp>{node}</StoreApp>;
