import { Report, ReportType } from '../types';
export const REPORT_ADD = '@@report/REPORT_ADD';
export const REPORT_REMOVE = '@@report/REPORT_REMOVE';
export const REPORT_CREATE = '@@report/REPORT_CREATE';

export const reportAdd = (report: Report) => ({ type: REPORT_ADD, report } as const);
export const reportRemove = (id: string) => ({ type: REPORT_REMOVE, id } as const);
export const reportCreate = (type: ReportType, text: string, timeOut?: number) =>
  ({
    type: REPORT_CREATE,
    report: { type, text, timeOut },
  } as const);

export const reportInfo = (mesage: string, timeOut?: number) => reportCreate('info', mesage, timeOut);
export const reportSuccess = (mesage: string, timeOut?: number) => reportCreate('success', mesage, timeOut);
export const reportWarning = (mesage: string, timeOut?: number) => reportCreate('warning', mesage, timeOut);
export const reportError = (error: string, timeOut?: number) => reportCreate('error', error.toString(), timeOut);
