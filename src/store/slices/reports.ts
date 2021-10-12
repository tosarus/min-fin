import { delay, fork, put } from 'redux-saga/effects';
import { createSliceSaga } from 'redux-toolkit-saga';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createReport, Report, ReportType } from '../../types';

const initialState = [] as Report[];

const {
  name,
  reducer: reportReducer,
  actions: sliceActions,
} = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    reportAdd(state, { payload: report }: PayloadAction<Report>) {
      state.push(report);
    },
    reportRemove(state, { payload: id }: PayloadAction<string>) {
      const index = state.findIndex((r) => r.id === id);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
  },
});

function* removeReportDelayed(reportId: string, timeOut: number) {
  yield delay(timeOut);
  yield put(sliceActions.reportRemove(reportId));
}

type ReportCreateArgs = { type: ReportType; text: string; timeOut?: number };
const {
  saga,
  actions: { reportCreate },
} = createSliceSaga({
  name,
  caseSagas: {
    *reportCreate({ payload: { type, text, timeOut } }: PayloadAction<ReportCreateArgs>) {
      const report = createReport(type, text);
      yield put(sliceActions.reportAdd(report));

      if (timeOut) {
        yield fork(removeReportDelayed, report.id, timeOut);
      }
    },
  },
});

const createReportAction = (type: ReportType) =>
  createAction(reportCreate.type, (text: string, timeOut?: number) => ({
    payload: { type, text, timeOut },
  }));

const actions = {
  ...sliceActions,
  reportInfo: createReportAction('info'),
  reportSuccess: createReportAction('success'),
  reportWarning: createReportAction('warning'),
  reportError: createReportAction('error'),
};

const reducer = {
  reports: reportReducer,
};

function selectors<Store extends { reports: typeof initialState }>() {
  return {
    reports: (store: Store) => store.reports,
  };
}

export default {
  actions,
  reducer,
  saga,
  selectors,
};
