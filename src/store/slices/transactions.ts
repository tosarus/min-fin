import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CashFlow, ImportTransaction, Transaction, WorldUpdate } from '../../types';
import { TransactionClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { applyWorldUpdate } from './actions';

const initialState = {
  cashFlows: null as CashFlow[] | null,
  transactions: null as Transaction[] | null,
};

const { name, reducer: transactionsReducer } = createSlice({
  name: 'transactions',
  initialState: initialState.transactions,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      applyWorldUpdate.type,
      (state, { payload: { transactions = [], removedTrans = [] } }: PayloadAction<WorldUpdate>) => {
        if (!state) {
          return transactions;
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
      }
    );
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *updateCashFlows({ payload: id }: PayloadAction<string>) {
      yield callPrivate(applyWorldUpdate, 'Updating cash flows', (auth) => new TransactionClient(auth).updateCashFlows(id));
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
    *importTransactionsCsv({ payload: { workbookId, file } }: PayloadAction<{ workbookId: string; file: File }>) {
      yield callPrivate(applyWorldUpdate, 'Importing transactions', (auth) =>
        new TransactionClient(auth).importCsv(workbookId, file)
      );
    },
    *importTransactions({ payload: { workbookId, raw } }: PayloadAction<{ workbookId: string; raw: ImportTransaction[] }>) {
      yield callPrivate(applyWorldUpdate, 'Importing transactions', (auth) =>
        new TransactionClient(auth).import(workbookId, raw)
      );
    },
  },
  sagaType: SagaType.TakeLatest,
});

const { reducer: cashFlowsReducer } = createSlice({
  name: 'cashFlows',
  initialState: initialState.cashFlows,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      applyWorldUpdate.type,
      (state, { payload: { cashFlows = [], removedTrans = [], removedFlows = [] } }: PayloadAction<WorldUpdate>) => {
        if (!state) {
          return cashFlows;
        }
        removedTrans.forEach((id) => {
          const index = state.findIndex((flow) => flow.transaction_id === id);
          if (index > -1) {
            state.splice(index, 1);
          }
        });
        removedFlows.forEach(([transaction_id, account_id]) => {
          const index = state.findIndex((flow) => flow.transaction_id === transaction_id && flow.account_id === account_id);
          if (index > -1) {
            state.splice(index, 1);
          }
        });
        cashFlows.forEach((update) => {
          const index = state.findIndex(
            (flow) => flow.transaction_id === update.transaction_id && flow.account_id == update.account_id
          );
          if (index > -1) {
            state.splice(index, 1, update);
          } else {
            state.push(update);
          }
        });
      }
    );
  },
});

const reducer = {
  cashFlows: cashFlowsReducer,
  transactions: transactionsReducer,
};

function selectors<Store extends typeof initialState>() {
  return {
    cashFlows: (store: Store) => store.cashFlows,
    transactions: (store: Store) => store.transactions,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
