import { Transaction, WorldUpdate } from '../../types';
import { PrivateClient } from './privateClient';

export class TransactionClient extends PrivateClient {
  list(workbookId: string): Promise<Transaction[]> {
    return this.getJson(`/api/transactions/${workbookId}`);
  }

  save(workbookId: string, trans: Partial<Transaction>): Promise<WorldUpdate> {
    return this.postJson(`/api/transactions/${workbookId}`, trans);
  }

  remove(workbookId: string, id: string): Promise<WorldUpdate> {
    return this.delete(`/api/transactions/${workbookId}/${id}`);
  }
}
