export type ReportType = 'info' | 'success' | 'warning' | 'error';

const genId = () => {
  const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return `id-${id}`;
};

export interface Report {
  id: string;
  type: ReportType;
  text: string;
}

export function createReport(type: ReportType, text: string): Report {
  return { id: genId(), type, text };
}
