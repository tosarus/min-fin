import React from 'react';
import { Provider } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { configureStore } from './configureStore';
import { rootSaga } from './sagas';

function StoreApp({ children }: { children: React.ReactNode }) {
  const auth = useAuth0();
  const store = configureStore({
    auth,
    ajaxStatus: { count: 0, messages: [] },
    forecast: null,
    reports: [],
  });
  store.runSaga(rootSaga);

  return <Provider store={store}>{children}</Provider>;
}

export function withStore(App: React.ComponentType) {
  return (
    <StoreApp>
      <App />
    </StoreApp>
  );
}
