import * as actions from './budgetsActions';
import { reducer, selectors } from './budgetsReducer';
import * as sagas from './budgetsSagas';

export default {
  actions,
  reducer,
  sagas,
  selectors,
};
