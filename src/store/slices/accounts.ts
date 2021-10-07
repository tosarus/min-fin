import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { AccountsClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { Account } from '../../types';

const initialState = null as Account[] | null;

const {
  name,
  reducer: accountsReducer,
  actions: { listAccountsDone, createAccountDone, updateAccountDone, removeAccountDone, resetAccounts },
} = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    listAccountsDone(state, { payload: accountList }: PayloadAction<Account[]>) {
      return accountList;
    },
    createAccountDone(state, { payload: account }: PayloadAction<Account>) {
      if (!state) {
        return [account];
      }
      state.push(account);
    },
    updateAccountDone(state, { payload: account }: PayloadAction<Account>) {
      if (!state) {
        return [account];
      }
      const index = state.findIndex((a) => a.id === account.id);
      if (index > -1) {
        state.splice(index, 1, account);
      } else {
        state.push(account);
      }
    },
    removeAccountDone(state, { payload: { id } }: PayloadAction<{ id: number }>) {
      if (state) {
        const index = state.findIndex((a) => a.id === id);
        if (index > -1) {
          state.splice(index, 1);
        }
      }
    },
    resetAccounts() {
      return initialState;
    },
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *listAccounts({ payload: workbookId }: PayloadAction<number>) {
      yield callPrivate(listAccountsDone, 'Loading account list', (auth) => new AccountsClient(auth).list(workbookId));
    },
    *createAccount({ payload: { workbookId, account } }: PayloadAction<{ workbookId: number; account: Partial<Account> }>) {
      yield callPrivate(createAccountDone, 'Creating account', (auth) =>
        new AccountsClient(auth).create(workbookId, account)
      );
    },
    *updateWorkbook({ payload: { workbookId, account } }: PayloadAction<{ workbookId: number; account: Partial<Account> }>) {
      yield callPrivate(updateAccountDone, 'Updating account', (auth) =>
        new AccountsClient(auth).update(workbookId, account)
      );
    },
    *removeWorkbook({ payload: { workbookId, id } }: PayloadAction<{ workbookId: number; id: number }>) {
      yield callPrivate(removeAccountDone, 'Removing account', (auth) => new AccountsClient(auth).remove(workbookId, id));
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  accounts: accountsReducer,
};

function selectors<Store extends { accounts: typeof initialState }>() {
  return {
    accounts: (store: Store) => store.accounts,
  };
}

export default {
  actions: { ...actions, resetAccounts },
  reducer,
  saga,
  selectors,
};
