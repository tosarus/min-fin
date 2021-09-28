import { delay, fork, put } from 'redux-saga/effects';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSliceSaga } from 'redux-toolkit-saga/lib/createSliceSaga';
import { Report, ReportType } from '../../types';

const initialState = [] as Report[];

const {
  name,
  reducer: reportReducer,
  actions,
} = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    reportAdd(state, action: PayloadAction<Report>) {
      return [...state, action.payload];
    },
    reportRemove(state, action: PayloadAction<string>) {
      return [...state.filter((r) => r.id !== action.payload)];
    },
  },
});

function* removeReportDelayed(reportId: string, timeOut: number) {
  yield delay(timeOut);
  yield put(actions.reportRemove(reportId));
}

const createReport = (type: ReportType) =>
  function* ({ payload: { text, timeOut } }: PayloadAction<{ text: string; timeOut?: number }>) {
    const report = new Report(type, text);
    yield put(actions.reportAdd(report));
    if (timeOut) {
      yield fork(removeReportDelayed, report.id, timeOut);
    }
  };

const { saga, actions: sagaActions } = createSliceSaga({
  name,
  caseSagas: {
    reportInfo: createReport('info'),
    reportSuccess: createReport('success'),
    reportWarning: createReport('warning'),
    reportError: createReport('error'),
  },
});

export const reducer = {
  reports: reportReducer,
};

export function selectors<Store extends { reports: typeof initialState }>() {
  return {
    reports: (store: Store) => store.reports,
  };
}

export default {
  actions: { ...actions, ...sagaActions },
  reducer,
  saga,
  selectors,
};
