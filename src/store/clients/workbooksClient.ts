import { PrivateClient } from './privateClient';
import { Workbook } from '../../types';

export class WorkbooksClient extends PrivateClient {
  list(): Promise<Workbook[]> {
    return this.getJson('/api/workbooks');
  }

  getActive(): Promise<Workbook> {
    return this.getJson('/api/workbooks/active');
  }

  create(workbook: Partial<Workbook>): Promise<Workbook> {
    return this.postJson('/api/workbooks', workbook);
  }

  update(workbook: Partial<Workbook>): Promise<Workbook> {
    return this.putJson('/api/workbooks', workbook);
  }

  remove(id: number): Promise<{ id: string }> {
    return this.delete(`/api/workbooks/${id}`);
  }
}
