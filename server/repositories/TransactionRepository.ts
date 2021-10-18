import { centsToStr, strToCents } from '@shared/calcs';
import { Transaction, TransactionType } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

type DbTransaction = {
  id: string;
  workbook_id: string;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  order: number;
  amount_cent: number;
  account_from_id: string;
  account_to_id: string;
};

const convertTransaction = ({ amount_cent, account_from_id, account_to_id, ...trans }: DbTransaction): Transaction => {
  return {
    ...trans,
    amount: centsToStr(amount_cent),
    account_from: account_from_id,
    account_to: account_to_id,
  };
};

export class TransactionRepository extends AbstractRepository {
  async getAll(workbookId: string): Promise<Transaction[]> {
    const { rows } = await this.qm().query<DbTransaction>({
      text: 'select * from transactions where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertTransaction);
  }

  async getById(workbookId: string, id: string): Promise<Transaction> {
    const { rows } = await this.qm().query<DbTransaction>({
      text: 'select * from transactions where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
    if (rows.length === 0) {
      throw `transaction ${id} not found for workbook ${workbookId}`;
    }
    return convertTransaction(rows[0]);
  }

  async findByAccountId(workbookId: string, accountId: string): Promise<Transaction[]> {
    const { rows } = await this.qm().query<DbTransaction>({
      text: 'select * from transactions where workbook_id = $1 and (account_from_id = $2 or account_to_id = $2)',
      values: [workbookId, accountId],
    });
    return rows.map(convertTransaction);
  }

  async create(workbookId: string, trans: Partial<Transaction>): Promise<Transaction> {
    const { date, type, description, detail, amount, account_from, account_to } = trans;
    const { rows } = await this.qm().query<DbTransaction>({
      text: `
insert into transactions(workbook_id, date, type, description, detail, amount_cent, account_from_id, account_to_id)
values($1, $2, $3, $4, $5, $6, $7, $8)
returning *`,
      values: [workbookId, date, type, description, detail, strToCents(amount || '0'), account_from, account_to],
    });
    return convertTransaction(rows[0]);
  }

  async update(workbookId: string, trans: Partial<Transaction>): Promise<Transaction> {
    const { id, date, type, description, detail, amount, account_from, account_to } = trans;
    const { rows } = await this.qm().query<DbTransaction>({
      text: `
update transactions
set date = coalesce($3, date),
    type = coalesce($4, type),
    description = coalesce($5, description),
    detail = coalesce($6, detail),
    amount_cent = coalesce($7, amount_cent),
    account_from_id = coalesce($8, account_from_id),
    account_to_id = coalesce($9, account_to_id)
where workbook_id = $1 and id = $2
returning *`,
      values: [workbookId, id, date, type, description, detail, amount && strToCents(amount), account_from, account_to],
    });
    return convertTransaction(rows[0]);
  }

  async remove(workbookId: string, id: string) {
    await this.qm().query({
      text: 'delete from transactions where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
    return { id };
  }
}
