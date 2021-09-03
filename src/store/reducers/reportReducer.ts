import { ReportActionTypes, REPORT_ADD, REPORT_REMOVE } from '../actions';
import { Report } from '../types';

const initialState: Report[] = [];

export default function reportsReducer(state = initialState, action: ReportActionTypes) {
  if (action.type === REPORT_ADD) {
    return [...state, action.report];
  }

  if (action.type === REPORT_REMOVE) {
    return [...state.filter((r) => r.id !== action.id)];
  }

  return state;
}
