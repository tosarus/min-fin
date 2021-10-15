import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, WorldUpdate } from '../../types';
import { TransactionClient } from '../clients';
import { callPrivate } from '../sagaCallers';

const initialState = null as Transaction[] | null;

const applyWorldUpdate = createAction<WorldUpdate>('applyWorldUpdate');

const {
  name,
  reducer: transactionsReducer,
  actions: { loadTransactionsDone },
} = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    loadTransactionsDone(state, { payload: transactions }: PayloadAction<Transaction[]>) {
      return transactions;
    },
  },
  extraReducers: {
    [applyWorldUpdate.type]: (state, { payload: { transactions, removedTrans } }: PayloadAction<WorldUpdate>) => {
      if (!state) {
        return transactions;
      }
      if (transactions.length === 0 && removedTrans.length === 0) {
        return state;
      }
      transactions.forEach((update) => {
        const index = state.findIndex((trans) => trans.id === update.id);
        if (index > -1) {
          state.splice(index, 1, update);
        } else {
          state.push(update);
        }
      });
      removedTrans.forEach((id) => {
        const index = state.findIndex((trans) => trans.id === id);
        if (index > -1) {
          state.splice(index, 1);
        }
      });
    },
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *loadTransactions({ payload: workbookId }: PayloadAction<string>) {
      yield callPrivate(loadTransactionsDone, 'Loading transaction list', (auth) =>
        new TransactionClient(auth).list(workbookId)
      );
    },
    *saveTransaction({
      payload: { workbookId, trans },
    }: PayloadAction<{ workbookId: string; trans: Partial<Transaction> }>) {
      yield callPrivate(applyWorldUpdate, 'Saving transaction', (auth) =>
        new TransactionClient(auth).save(workbookId, trans)
      );
    },
    *removeTransaction({ payload: { workbookId, id } }: PayloadAction<{ workbookId: string; id: string }>) {
      yield callPrivate(applyWorldUpdate, 'Removing transaction', (auth) =>
        new TransactionClient(auth).remove(workbookId, id)
      );
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  transactions: transactionsReducer,
};

function selectors<Store extends { transactions: typeof initialState }>() {
  return {
    transactions: (store: Store) => store.transactions,
  };
}
export { applyWorldUpdate };

export default {
  actions,
  reducer,
  saga,
  selectors,
};
