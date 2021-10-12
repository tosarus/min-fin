import { Transaction, WorldUpdate } from '../../types';
import { PrivateClient } from './privateClient';

export class TransactionClient extends PrivateClient {
  list(workbookId: number): Promise<Transaction[]> {
    return this.getJson(`/api/transactions/${workbookId}`);
  }

  create(workbookId: number, trans: Partial<Transaction>): Promise<WorldUpdate> {
    return this.postJson(`/api/transactions/${workbookId}`, trans);
  }

  update(workbookId: number, trans: Partial<Transaction>): Promise<WorldUpdate> {
    return this.putJson(`/api/transactions/${workbookId}`, trans);
  }

  remove(workbookId: number, id: number): Promise<WorldUpdate> {
    return this.delete(`/api/transactions/${workbookId}/${id}`);
  }
}
