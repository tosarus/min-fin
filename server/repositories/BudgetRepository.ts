import { centsToStr, strToCents } from '@shared/calcs';
import { BudgetAccount } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

type DbBudget = {
  id: string;
  workbook_id: string;
  account_id: string;
  amount_cent: number;
  month: string;
};

const convertBudget = ({ amount_cent, ...budget }: DbBudget): BudgetAccount => {
  return {
    ...budget,
    amount: centsToStr(amount_cent),
  };
};

export class BudgetRepository extends AbstractRepository {
  async getAll(workbookId: string): Promise<BudgetAccount[]> {
    const { rows } = await this.qm().query<DbBudget>({
      text: 'select * from budget_accounts where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertBudget);
  }

  async getAllByMonth(workbookId: string, month: string): Promise<BudgetAccount[]> {
    const { rows } = await this.qm().query<DbBudget>({
      text: 'select * from budget_accounts where workbook_id = $1 and month = $2',
      values: [workbookId, month],
    });
    return rows.map(convertBudget);
  }

  async create(workbookId: string, budget: Partial<BudgetAccount>): Promise<BudgetAccount> {
    const { account_id, amount = '0', month } = budget;
    const { rows } = await this.qm().query<DbBudget>({
      name: 'budgets-create',
      text: 'insert into budget_accounts(workbook_id, account_id, amount_cent, month) values($1, $2, $3, $4) returning *',
      values: [workbookId, account_id, strToCents(amount), month],
    });
    return convertBudget(rows[0]);
  }

  async update(workbookId: string, budget: Partial<BudgetAccount>): Promise<BudgetAccount> {
    const { id, amount } = budget;
    const { rows } = await this.qm().query<DbBudget>({
      name: 'budgets-update',
      text: 'update budget_accounts set amount_cent = $3 where workbook_id = $1 and id = $2 returning *',
      values: [workbookId, id, amount && strToCents(amount)],
    });
    return convertBudget(rows[0]);
  }

  async remove(workbookId: string, id: string) {
    await this.qm().query({
      text: 'delete from budget_accounts where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
    return { id };
  }

  async removeByWorkbook(workbookId: string) {
    await this.qm().query({
      text: 'delete from budget_accounts where workbook_id = $1',
      values: [workbookId],
    });
  }
}
