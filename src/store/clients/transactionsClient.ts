import { ImportTransaction, Transaction, WorldUpdate } from '../../types';
import { PrivateClient } from './privateClient';

export class TransactionClient extends PrivateClient {
  list(workbookId: string): Promise<Transaction[]> {
    return this.getJson(`/api/transactions/${workbookId}`);
  }

  updateCashFlows(workbookId: string): Promise<WorldUpdate> {
    return this.getJson(`/api/transactions/${workbookId}/cashflows`);
  }

  save(workbookId: string, trans: Partial<Transaction>): Promise<WorldUpdate> {
    return this.postJson(`/api/transactions/${workbookId}`, trans);
  }

  remove(workbookId: string, id: string): Promise<WorldUpdate> {
    return this.delete(`/api/transactions/${workbookId}/${id}`);
  }

  export(workbookId: string): Promise<ImportTransaction[]> {
    return this.getJson(`/api/transactions/${workbookId}/export`);
  }

  import(workbookId: string, raw: ImportTransaction[]): Promise<WorldUpdate> {
    return this.postJson(`/api/transactions/${workbookId}/import`, raw);
  }

  importCsv(workbookId: string, file: File): Promise<WorldUpdate> {
    const formData = new FormData();
    formData.append('trans', file, file.name);
    return this.postForm(`/api/transactions/${workbookId}/importCsv`, formData);
  }
}
