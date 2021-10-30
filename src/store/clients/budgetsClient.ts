import { AccountType, BudgetAccount, WorldUpdate } from '../../types';
import { PrivateClient } from './privateClient';

export class BudgetsClient extends PrivateClient {
  list(workbookId: string): Promise<BudgetAccount[]> {
    return this.getJson(`/api/budgets/${workbookId}`);
  }

  save(workbookId: string, account: Partial<BudgetAccount>): Promise<BudgetAccount> {
    return this.postJson(`/api/budgets/${workbookId}`, account);
  }

  remove(workbookId: string, id: string): Promise<{ id: string }> {
    return this.delete(`/api/budgets/${workbookId}/${id}`);
  }

  copyFromPrevious(workbookId: string, type: AccountType, month: string): Promise<WorldUpdate> {
    return this.getJson(`/api/budgets/${workbookId}/copy/${type}/${month}`);
  }
}
