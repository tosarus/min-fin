import { Workbook } from '../../types';
import { PrivateClient } from './privateClient';

export class WorkbooksClient extends PrivateClient {
  list(): Promise<Workbook[]> {
    return this.getJson('/api/workbooks');
  }

  getActive(): Promise<Workbook> {
    return this.getJson('/api/workbooks/active');
  }

  save(workbook: Partial<Workbook>): Promise<Workbook> {
    return this.postJson('/api/workbooks', workbook);
  }

  remove(id: string): Promise<{ id: string }> {
    return this.delete(`/api/workbooks/${id}`);
  }
}
