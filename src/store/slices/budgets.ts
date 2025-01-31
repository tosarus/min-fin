import { createSliceSaga, SagaType } from 'redux-toolkit-saga';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountType, BudgetAccount, WorldUpdate } from '../../types';
import { BudgetsClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { applyWorldUpdate } from './actions';

const initialState = null as BudgetAccount[] | null;

const {
  name,
  reducer: budgetsReducer,
  actions: { saveBudgetDone, removeBudgetDone },
} = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    saveBudgetDone(state, { payload: budget }: PayloadAction<BudgetAccount>) {
      if (!state) {
        return [budget];
      }
      const index = state.findIndex((b) => b.id === budget.id);
      if (index > -1) {
        state.splice(index, 1, budget);
      } else {
        state.push(budget);
      }
    },
    removeBudgetDone(state, { payload: { id } }: PayloadAction<{ id: string }>) {
      if (state) {
        const index = state.findIndex((b) => b.id === id);
        if (index > -1) {
          state.splice(index, 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(applyWorldUpdate.type, (state, { payload: { budgets = [] } }: PayloadAction<WorldUpdate>) => {
      if (!state) {
        return budgets;
      }
      budgets.forEach((update) => {
        const index = state.findIndex((b) => b.id === update.id);
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
    *saveBudget({ payload: { workbookId, budget } }: PayloadAction<{ workbookId: string; budget: Partial<BudgetAccount> }>) {
      yield callPrivate(saveBudgetDone, 'Saving budget', (auth) => new BudgetsClient(auth).save(workbookId, budget));
    },
    *removeBudget({ payload: { workbookId, id } }: PayloadAction<{ workbookId: string; id: string }>) {
      yield callPrivate(removeBudgetDone, 'Removing budget', (auth) => new BudgetsClient(auth).remove(workbookId, id));
    },
    *copyFromPrevious({
      payload: { workbookId, type, month },
    }: PayloadAction<{ workbookId: string; type: AccountType; month: string }>) {
      yield callPrivate(applyWorldUpdate, 'Copying budgets from previous month', (auth) =>
        new BudgetsClient(auth).copyFromPrevious(workbookId, type, month)
      );
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  budgets: budgetsReducer,
};

function selectors<Store extends { budgets: typeof initialState }>() {
  return {
    budgets: (store: Store) => store.budgets,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
