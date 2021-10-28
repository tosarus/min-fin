import { Service } from 'typedi';
import { BudgetAccount } from '@shared/types';
import { BudgetRepository } from '../repositories';
import { BaseService } from './BaseService';

@Service()
export class BudgetsService extends BaseService {
  getAll(workbookId: string) {
    return this.resolve(BudgetRepository).getAll(workbookId);
  }

  getAllByMonth(workbookId: string, month: string) {
    return this.resolve(BudgetRepository).getAllByMonth(workbookId, month);
  }

  async save(workbookId: string, budget: Partial<BudgetAccount>) {
    if (!budget) {
      throw 'Save budget: should have a body';
    }

    if (!budget.account_id || !budget.month || !budget.amount) {
      throw 'Save budget: should provide account_id, month and amount';
    }

    if (budget.id) {
      return await this.resolve(BudgetRepository).update(workbookId, budget);
    } else {
      return await this.resolve(BudgetRepository).create(workbookId, budget);
    }
  }

  remove(workbookId: string, id: string) {
    return this.resolve(BudgetRepository).remove(workbookId, id);
  }
}
