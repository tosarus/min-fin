import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { BudgetsClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { Budget } from '../../types';

const initialState = null as Budget[] | null;

const {
  name,
  reducer: budgetReducer,
  actions: { listBudgetsDone, getActiveBudgetDone, createBudgetDone, updateBudgetDone, removeBudgetDone, resetBudgets },
} = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    listBudgetsDone(state, { payload: budgetList }: PayloadAction<Budget[]>) {
      return budgetList;
    },
    getActiveBudgetDone(state, { payload: budget }: PayloadAction<Budget>) {
      if (!state) {
        return [budget];
      }
      const index = state.findIndex((b) => b.id === budget.id);
      if (index === -1) {
        state.push(budget);
      } else {
        state[index] = budget;
      }
    },
    createBudgetDone(state, { payload: budget }: PayloadAction<Budget>) {
      if (!state) {
        return [budget];
      }
      state.push(budget);
    },
    updateBudgetDone(state, { payload: budget }: PayloadAction<Budget>) {
      if (!state) {
        return [budget];
      }
      const index = state.findIndex((b) => b.id === budget.id);
      if (index > -1) {
        state[index] = budget;
      } else {
        state.push(budget);
      }
    },
    removeBudgetDone(state, { payload: id }: PayloadAction<number>) {
      if (state) {
        const index = state.findIndex((b) => b.id === id);
        if (index >= 0) {
          state.splice(index, 1);
        }
      }
    },
    resetBudgets() {
      return initialState;
    },
  },
});

const { saga, actions } = createSliceSaga({
  name,
  caseSagas: {
    *listBudgets() {
      yield callPrivate(listBudgetsDone, 'Loading budget list', (auth) => new BudgetsClient(auth).list());
    },
    *getActiveBudget() {
      yield callPrivate(getActiveBudgetDone, 'Loading active budget', (auth) => new BudgetsClient(auth).getActive());
    },
    *createBudget({ payload: budget }: PayloadAction<Partial<Budget>>) {
      yield callPrivate(createBudgetDone, 'Creating budget', (auth) => new BudgetsClient(auth).create(budget));
    },
    *updateBudget({ payload: budget }: PayloadAction<Partial<Budget>>) {
      yield callPrivate(updateBudgetDone, 'Updating budget', (auth) => new BudgetsClient(auth).update(budget));
    },
    *removeBudget({ payload: id }: PayloadAction<number>) {
      yield callPrivate(removeBudgetDone, 'Removing budget', (auth) => new BudgetsClient(auth).remove(id));
    },
  },
  sagaType: SagaType.TakeLatest,
});

const reducer = {
  budgets: budgetReducer,
};

function selectors<Store extends { budgets: typeof initialState }>() {
  return {
    budgets: (store: Store) => store.budgets,
  };
}

export default {
  actions: { ...actions, resetBudgets },
  reducer,
  saga,
  selectors,
};
