import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga, SagaType } from 'redux-toolkit-saga/lib/createSliceSaga';
import { BudgetsClient } from '../clients';
import { callPrivate } from '../sagaCallers';
import { Budget } from '../../types';

const initialState = null as Budget[] | null;

const {
  name,
  reducer: budgetReducer,
  actions: { listBudgetsDone, getActiveBudgetDone, createBudgetDone, updateBudgetDone, removeBudgetDone },
} = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    listBudgetsDone(state, action: PayloadAction<Budget[]>) {
      return action.payload;
    },
    getActiveBudgetDone(state, action: PayloadAction<Budget>) {
      return state ? [...state.filter((budget) => budget.id !== action.payload.id), action.payload] : [action.payload];
    },
    createBudgetDone(state, action: PayloadAction<Budget>) {
      return state ? [...state, action.payload] : [action.payload];
    },
    updateBudgetDone(state, action: PayloadAction<Budget>) {
      return state ? [...state.filter((budget) => budget.id !== action.payload.id), action.payload] : [action.payload];
    },
    removeBudgetDone(state, action: PayloadAction<Budget>) {
      return state ? [...state.filter((budget) => budget.id !== action.payload.id)] : state;
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
  actions,
  reducer,
  saga,
  selectors,
};
