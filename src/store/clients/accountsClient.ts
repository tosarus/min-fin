import { PrivateClient } from './privateClient';
import { Account } from '../../types';

export class AccountsClient extends PrivateClient {
  list(workbookId: number): Promise<Account[]> {
    return this.getJson(`/api/accounts/${workbookId}`);
  }

  create(workbookId: number, account: Partial<Account>): Promise<Account> {
    return this.postJson(`/api/accounts/${workbookId}`, account);
  }

  update(workbookId: number, account: Partial<Account>): Promise<Account> {
    return this.putJson(`/api/accounts/${workbookId}`, account);
  }

  remove(workbookId: number, id: number): Promise<{ id: string }> {
    return this.delete(`/api/accounts/${workbookId}/${id}`);
  }
}
