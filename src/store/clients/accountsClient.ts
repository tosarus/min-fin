import { Account } from '../../types';
import { PrivateClient } from './privateClient';

export class AccountsClient extends PrivateClient {
  list(workbookId: string): Promise<Account[]> {
    return this.getJson(`/api/accounts/${workbookId}`);
  }

  save(workbookId: string, account: Partial<Account>): Promise<Account> {
    return this.postJson(`/api/accounts/${workbookId}`, account);
  }

  remove(workbookId: string, id: string): Promise<{ id: string }> {
    return this.delete(`/api/accounts/${workbookId}/${id}`);
  }
}
