import * as Actions from './reportActions';
import { ActionsType } from '../actions';
import { Report } from '../types';

const initialState: Report[] = [];

function reporReducer(state = initialState, action: ActionsType<typeof Actions>) {
  if (action.type === Actions.REPORT_ADD) {
    return [...state, action.report];
  }

  if (action.type === Actions.REPORT_REMOVE) {
    return [...state.filter((r) => r.id !== action.id)];
  }

  return state;
}

export const reducer = {
  reports: reporReducer,
};

export function selectors<Store extends { reports: typeof initialState }>() {
  return {
    reports: (store: Store) => store.reports,
  };
}
