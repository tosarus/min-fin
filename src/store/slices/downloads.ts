import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImportTransaction } from '../../types';
import { TransactionClient } from '../clients';
import { callPrivate } from '../sagaCallers';

const initialState = {
  transactions: null as ImportTransaction[] | null,
};

const {
  name,
  reducer: downloads,
  actions: { exportTransactionsDone },
} = createSlice({
  name: 'downloads',
  initialState: initialState,
  reducers: {
    exportTransactionsDone(state, { payload: transactions }: PayloadAction<ImportTransaction[]>) {
      state.transactions = transactions;
    },
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *exportTransactions({ payload: id }: PayloadAction<string>) {
      yield callPrivate(exportTransactionsDone, 'Importing transactions', (auth) => new TransactionClient(auth).export(id));
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  downloads,
};

function selectors<Store extends { downloads: typeof initialState }>() {
  return {
    exportedTransactions: (store: Store) => store.downloads.transactions,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
