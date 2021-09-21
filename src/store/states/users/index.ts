import * as actions from './usersActions';
import { reducer, selectors } from './usersReducer';
import * as sagas from './usersSagas';

export { UsersClient } from './usersClient';

export default {
  actions,
  reducer,
  sagas,
  selectors,
};
