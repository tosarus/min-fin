import { Injectable } from '@decorators/di';
import { centsToStr, strToCents } from '@shared/calcs';
import { Transaction, TransactionType } from '@shared/types';
import db from '../db';

type DbTransaction = {
  id: number;
  workbook_id: number;
  date: Date;
  type: TransactionType;
  description: string;
  detail: string;
  amount_cent: number;
  account_from_id: number;
  account_to_id: number;
};

const convertTransaction = ({ amount_cent, account_from_id, account_to_id, ...trans }: DbTransaction): Transaction => {
  return {
    ...trans,
    amount: centsToStr(amount_cent),
    account_from: account_from_id,
    account_to: account_to_id,
  };
};

@Injectable()
export class TransactionRepository {
  async getAll(workbookId: number): Promise<Transaction[]> {
    const { rows } = await db().query<DbTransaction>({
      text: 'select * from transactions where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertTransaction);
  }

  async getById(workbookId: number, id: number): Promise<Transaction> {
    const { rows } = await db().query<DbTransaction>({
      text: 'select * from transactions where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
    if (rows.length === 0) {
      throw `transaction ${id} not found for workbook ${workbookId}`;
    }
    return convertTransaction(rows[0]);
  }

  async findByAccountId(workbookId: number, accountId: number): Promise<Transaction[]> {
    const { rows } = await db().query<DbTransaction>({
      text: 'select * from transactions where workbook_id = $1 and (account_from_id = $2 or account_to_id = $2)',
      values: [workbookId, accountId],
    });
    return rows.map(convertTransaction);
  }

  async create(workbookId: number, trans: Partial<Transaction>): Promise<Transaction> {
    const { date, type, description, detail, amount, account_from, account_to } = trans;
    const { rows } = await db().query<DbTransaction>({
      text: `
insert into transactions(workbook_id, date, type, description, detail, amount_cent, account_from_id, account_to_id)
values($1, $2, $3, $4, $5, $6, $7, $8)
returning *`,
      values: [workbookId, date, type, description, detail, strToCents(amount || '0'), account_from, account_to],
    });
    return convertTransaction(rows[0]);
  }

  async update(workbookId: number, trans: Partial<Transaction>): Promise<Transaction> {
    const { id, date, type, description, detail, amount, account_from, account_to } = trans;
    const { rows } = await db().query<DbTransaction>({
      text: `
update transactions
set date = coalesce($3, date),
    type = coalesce($4, type),
    description = coalesce($5, description),
    detail = coalesce($6, detail),
    amount_cent = coalesce($7, amount_cent)
    account_from_id = coalesce($8, account_from_id)
    account_to_id = coalesce($9, account_to_id)
where workbook_id = $1 and id = $2
returning *`,
      values: [workbookId, id, date, type, description, detail, amount && strToCents(amount), account_from, account_to],
    });
    return convertTransaction(rows[0]);
  }

  async remove(workbookId: number, id: number) {
    await db().query({
      text: 'delete from transactions where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
    return { id };
  }
}
