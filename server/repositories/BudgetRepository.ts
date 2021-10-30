import { centsToStr, sanitizeDate, strToCents } from '@shared/calcs';
import { AccountType, BudgetAccount } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

type DbBudget = {
  id: string;
  workbook_id: string;
  account_id: string;
  amount_cent: number;
  month: string;
};

const convertBudget = ({ amount_cent, month, ...budget }: DbBudget): BudgetAccount => {
  return {
    ...budget,
    month: sanitizeDate(month),
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

  async getAllByMonth(workbookId: string, type: AccountType, month: string): Promise<BudgetAccount[]> {
    const { rows } = await this.qm().query<DbBudget>({
      text: `
select ba.*
from budget_accounts ba join accounts a on ba.account_id = a.id
where ba.workbook_id = $1 and ba.month = $2 and a.type = $3`,
      values: [workbookId, month, type],
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
