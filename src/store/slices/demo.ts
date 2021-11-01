import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherForecast, CsvTrans } from '../../types';
import { ForecastClient, TransClient } from '../clients';
import { callPublic, callPrivate } from '../sagaCallers';

type DemoState = {
  forecast: WeatherForecast[] | null;
  trans: CsvTrans[] | null;
};
const initialState = { forecast: null, trans: null } as DemoState;

const {
  name,
  actions: { loadDemoForecastDone, loadDemoTransactionsDone },
  reducer: demoReducer,
} = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    loadDemoForecastDone(state, { payload: forecast }: PayloadAction<WeatherForecast[]>) {
      state.forecast = forecast;
    },
    loadDemoTransactionsDone(state, { payload: trans }: PayloadAction<CsvTrans[]>) {
      state.trans = trans;
    },
  },
});

const { actions, saga } = createSliceSaga({
  name,
  caseSagas: {
    *loadDemoForecast() {
      yield callPublic(loadDemoForecastDone, 'Loading demo forecast', () => new ForecastClient().load());
    },
    *loadDemoTransactions() {
      yield callPrivate(loadDemoTransactionsDone, 'Loading demo transactions', (auth) => new TransClient(auth).load());
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  demo: demoReducer,
};

function selectors<Store extends { demo: typeof initialState }>() {
  return {
    demoForecast: (store: Store) => store.demo.forecast,
    demoTransactions: (store: Store) => store.demo.trans,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
