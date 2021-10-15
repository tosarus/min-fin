import { Account } from '../../types';
import { PrivateClient } from './privateClient';

export class AccountsClient extends PrivateClient {
  list(workbookId: number): Promise<Account[]> {
    return this.getJson(`/api/accounts/${workbookId}`);
  }

  save(workbookId: number, account: Partial<Account>): Promise<Account> {
    return this.postJson(`/api/accounts/${workbookId}`, account);
  }

  remove(workbookId: number, id: number): Promise<{ id: string }> {
    return this.delete(`/api/accounts/${workbookId}/${id}`);
  }
}
