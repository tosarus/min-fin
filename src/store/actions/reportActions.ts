import { Report, ReportType } from '../types';
export const REPORT_ADD = 'REPORT_ADD';
export const REPORT_REMOVE = 'REPORT_REMOVE';
export const REPORT_CREATE = 'REPORT_CREATE';

interface ReportAddAction {
  type: typeof REPORT_ADD;
  report: Report;
}

interface ReportRemoveAction {
  type: typeof REPORT_REMOVE;
  id: string;
}

interface ReportCreateAction {
  type: typeof REPORT_CREATE;
  report: { type: ReportType; text: string; timeOut?: number };
}

export type ReportActionTypes = ReportAddAction | ReportRemoveAction | ReportCreateAction;

export const reportAdd = (report: Report) => ({ type: REPORT_ADD, report });
export const reportRemove = (id: string) => ({ type: REPORT_REMOVE, id });
export const reportCreate = (type: ReportType, text: string, timeOut?: number) => ({
  type: REPORT_CREATE,
  report: { type, text, timeOut },
});

export const reportInfo = (mesage: string, timeOut?: number) => reportCreate('info', mesage, timeOut);
export const reportSuccess = (mesage: string, timeOut?: number) => reportCreate('success', mesage, timeOut);
export const reportWarning = (mesage: string, timeOut?: number) => reportCreate('warning', mesage, timeOut);
export const reportError = (error: string, timeOut?: number) => reportCreate('error', error.toString(), timeOut);
