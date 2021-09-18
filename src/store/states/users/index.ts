export * from '../../../clients/UserClient';

import * as actions from './usersActions';
import { reducer, selectors } from './usersReducer';
import * as sagas from './usersSagas';

export default {
  actions,
  reducer,
  sagas,
  selectors,
};
