import { take, fork, delay, put } from 'redux-saga/effects';
import { REPORT_CREATE, reportAdd, reportRemove } from '../actions';
import { Report } from '../types';

export function* removeReportDelayed(reportId: string, timeOut: number) {
  yield delay(timeOut);
  yield put(reportRemove(reportId));
}

export function* reportCreateSaga() {
  while (true) {
    const {
      report: { type, text, timeOut },
    } = yield take(REPORT_CREATE);

    const report = new Report(type, text);
    yield put(reportAdd(report));

    if (timeOut) {
      yield fork(removeReportDelayed, report.id, timeOut);
    }
  }
}
