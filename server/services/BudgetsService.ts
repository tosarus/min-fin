import { Service } from 'typedi';
import { isValidMonth, previousMonth } from '@shared/calcs';
import { AccountType, BudgetAccount, WorldUpdate } from '@shared/types';
import { BudgetRepository } from '../repositories';
import { BaseService } from './BaseService';
import { InTransaction } from './InTransaction';

@Service()
export class BudgetsService extends BaseService {
  getAll(workbookId: string) {
    return this.resolve(BudgetRepository).getAll(workbookId);
  }

  @InTransaction()
  async copyFromPrevious(workbookId: string, type: AccountType, month: string): Promise<WorldUpdate> {
    if (!isValidMonth(month)) {
      throw 'CopyFromPrevious: wrong month format';
    }

    const repo = this.resolve(BudgetRepository);
    const prevMonth = previousMonth(month);

    const previous = await repo.getAllByMonth(workbookId, type, prevMonth);
    const budgets = [] as BudgetAccount[];
    for (const budget of previous) {
      budget.month = month;
      budgets.push(await repo.create(workbookId, budget));
    }
    return { budgets };
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
