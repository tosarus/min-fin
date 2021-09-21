import * as Actions from './budgetsActions';
import { ActionsType } from '../actions';
import { Budget } from '../types';

const initialState: Budget[] | null = null;

function budgetsReducer(state = initialState, action: ActionsType<typeof Actions>) {
  switch (action.type) {
    case Actions.LIST_BUDGETS_DONE:
      return [...action.budgets];

    case Actions.GET_ACTIVE_BUDGET_DONE:
    case Actions.UPDATE_BUDGET_DONE:
      return state ? [...state.filter((budget) => budget.id !== action.budget.id), action.budget] : [action.budget];

    case Actions.CREATE_BUDGET_DONE:
      return state ? [...state, action.budget] : [action.budget];

    case Actions.REMOVE_BUDGET_DONE:
      return state ? [...state.filter((budget) => budget.id !== action.id)] : state;
  }

  return state;
}

export const reducer = {
  budgets: budgetsReducer,
};

export function selectors<Store extends { budgets: typeof initialState }>() {
  return {
    budgets: (store: Store) => store.budgets,
  };
}
