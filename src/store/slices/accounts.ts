import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, WorldUpdate } from '../../types';
import { AccountsClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { applyWorldUpdate } from './actions';

const initialState = null as Account[] | null;

const {
  name,
  reducer: accountsReducer,
  actions: { saveAccountDone },
} = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    saveAccountDone(state, { payload: account }: PayloadAction<Account>) {
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
    removeAccountDone(state, { payload: { id } }: PayloadAction<{ id: string }>) {
      if (state) {
        const index = state.findIndex((a) => a.id === id);
        if (index > -1) {
          state.splice(index, 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyWorldUpdate.type, (state, { payload: { accounts = [] } }: PayloadAction<WorldUpdate>) => {
      if (!state) {
        return accounts;
      }
      accounts.forEach((update) => {
        const index = state.findIndex((acc) => acc.id === update.id);
        if (index > -1) {
          state.splice(index, 1, update);
        } else {
          state.push(update);
        }
      });
    });
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *saveAccount({ payload: { workbookId, account } }: PayloadAction<{ workbookId: string; account: Partial<Account> }>) {
      yield callPrivate(saveAccountDone, 'Saving account', (auth) => new AccountsClient(auth).save(workbookId, account));
    },
    *removeAccount({ payload: { workbookId, id } }: PayloadAction<{ workbookId: string; id: string }>) {
      yield callPrivate(applyWorldUpdate, 'Removing account', (auth) => new AccountsClient(auth).remove(workbookId, id));
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
  actions,
  reducer,
  saga,
  selectors,
};
