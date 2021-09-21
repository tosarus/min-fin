import { takeLatest } from 'redux-saga/effects';
import * as Actions from './budgetsActions';
import { BudgetsClient } from './budgetsClient';
import { sagaWithAuth } from '../sagas';

export function* listBudgetsSaga() {
  yield takeLatest(Actions.LIST_BUDGETS, function* () {
    yield sagaWithAuth(Actions.listBudgetsDone, 'Loading budget list', [BudgetsClient, BudgetsClient.prototype.list]);
  });
}

export function* getActiveBudgetSaga() {
  yield takeLatest(Actions.GET_ACTIVE_BUDGET, function* () {
    yield sagaWithAuth(Actions.getActiveBudgetDone, 'Loading active budget', [
      BudgetsClient,
      BudgetsClient.prototype.getActive,
    ]);
  });
}

export function* createBudgetSaga() {
  yield takeLatest(Actions.CREATE_BUDGET, function* ({ budget }: ReturnType<typeof Actions.createBudget>) {
    yield sagaWithAuth(
      Actions.createBudgetDone,
      'Creating budget',
      [BudgetsClient, BudgetsClient.prototype.create],
      budget
    );
  });
}

export function* updateBudgetSaga() {
  yield takeLatest(Actions.UPDATE_BUDGET, function* ({ budget }: ReturnType<typeof Actions.updateBudget>) {
    yield sagaWithAuth(
      Actions.updateBudgetDone,
      'Updating budget',
      [BudgetsClient, BudgetsClient.prototype.update],
      budget
    );
  });
}

export function* removeBudgetSaga() {
  yield takeLatest(Actions.REMOVE_BUDGET, function* ({ id }: ReturnType<typeof Actions.removeBudget>) {
    yield sagaWithAuth(
      Actions.removeBudgetDone,
      'Removing budget',
      [BudgetsClient, BudgetsClient.prototype.remove],
      id
    );
  });
}
