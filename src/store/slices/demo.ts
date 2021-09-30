import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { ForecastClient, TransClient } from '../clients';
import { callPublic, callPrivate } from '../sagaCallers';
import { WeatherForecast, CsvTrans } from '../../types';

type DemoState = {
  forecast: WeatherForecast[] | null;
  trans: CsvTrans[] | null;
};
const initialState = { forecast: null, trans: null } as DemoState;

const {
  name,
  actions: { loadForecastDone, loadTransactionsDone },
  reducer: demoReducer,
} = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    loadForecastDone(state, { payload: forecast }: PayloadAction<WeatherForecast[]>) {
      state.forecast = forecast;
    },
    loadTransactionsDone(state, { payload: trans }: PayloadAction<CsvTrans[]>) {
      state.trans = trans;
    },
  },
});

const { actions, saga } = createSliceSaga({
  name,
  caseSagas: {
    *loadForecast() {
      yield callPublic(loadForecastDone, 'Loading forecast', () => new ForecastClient().load());
    },
    *loadTransactions() {
      yield callPrivate(loadTransactionsDone, 'Loading transactions', (auth) => new TransClient(auth).load());
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  demo: demoReducer,
};

function selectors<Store extends { demo: typeof initialState }>() {
  return {
    forecast: (store: Store) => store.demo.forecast,
    transactions: (store: Store) => store.demo.trans,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
