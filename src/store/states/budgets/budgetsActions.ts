import { Budget } from '../types';

export const LIST_BUDGETS = '@@budgets/LIST_BUDGETS';
export const LIST_BUDGETS_DONE = '@@budgets/LIST_BUDGETS_DONE';
export const GET_ACTIVE_BUDGET = '@@budgets/GET_ACTIVE_BUDGET';
export const GET_ACTIVE_BUDGET_DONE = '@@budgets/GET_ACTIVE_BUDGET_DONE';
export const CREATE_BUDGET = '@@budgets/CREATE_BUDGET';
export const CREATE_BUDGET_DONE = '@@budgets/CREATE_BUDGET_DONE';
export const UPDATE_BUDGET = '@@budgets/UPDATE_BUDGET';
export const UPDATE_BUDGET_DONE = '@@budgets/UPDATE_BUDGET_DONE';
export const REMOVE_BUDGET = '@@budgets/REMOVE_BUDGET';
export const REMOVE_BUDGET_DONE = '@@budgets/REMOVE_BUDGET_DONE';

export const listBudgets = () => ({ type: LIST_BUDGETS } as const);
export const listBudgetsDone = (budgets: Budget[]) => ({ type: LIST_BUDGETS_DONE, budgets } as const);
export const getActiveBudget = () => ({ type: GET_ACTIVE_BUDGET } as const);
export const getActiveBudgetDone = (budget: Budget) => ({ type: GET_ACTIVE_BUDGET_DONE, budget } as const);
export const createBudget = (budget: Partial<Budget>) => ({ type: CREATE_BUDGET, budget } as const);
export const createBudgetDone = (budget: Budget) => ({ type: CREATE_BUDGET_DONE, budget } as const);
export const updateBudget = (budget: Partial<Budget>) => ({ type: UPDATE_BUDGET, budget } as const);
export const updateBudgetDone = (budget: Budget) => ({ type: UPDATE_BUDGET_DONE, budget } as const);
export const removeBudget = (id: number) => ({ type: REMOVE_BUDGET, id } as const);
export const removeBudgetDone = (id: number) => ({ type: REMOVE_BUDGET_DONE, id } as const);
