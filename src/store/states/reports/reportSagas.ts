import { fork, delay, put, takeEvery } from 'redux-saga/effects';
import { REPORT_CREATE, reportAdd, reportRemove } from './reportActions';
import { Report } from '../types';

function* removeReportDelayed(reportId: string, timeOut: number) {
  yield delay(timeOut);
  yield put(reportRemove(reportId));
}

export function* reportCreateSaga() {
  yield takeEvery(REPORT_CREATE, function* ({ report: { type, text, timeOut } }: any) {
    const report = new Report(type, text);
    yield put(reportAdd(report));

    if (timeOut) {
      yield fork(removeReportDelayed, report.id, timeOut);
    }
  });
}
