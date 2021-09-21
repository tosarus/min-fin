import { PrivateClient } from '../clients';
import { Budget } from '../types';

export class BudgetsClient extends PrivateClient {
  list(): Promise<Budget[]> {
    return this.getJson('/api/budgets');
  }

  getActive(): Promise<Budget> {
    return this.getJson('/api/budgets/active');
  }

  create(budget: Partial<Budget>): Promise<Budget> {
    return this.postJson('/api/budgets', budget);
  }

  update(budget: Partial<Budget>): Promise<Budget> {
    return this.putJson('/api/budgets', budget);
  }

  remove(id: number): Promise<{ id: string }> {
    return this.delete(`/api/budgets/${id}`);
  }
}
