import { Transaction, TransactionType } from '@shared/types';
import { centsToStr, strToCents } from './utils';
import db from '../db';

type DbTransaction = {
  id: number;
  workbook_id: number;
  date: Date;
  type: TransactionType;
  description: string;
  detail: string;
  amount_cent: number;
  account_from: number;
  account_to: number;
};

const convertTransaction = ({ amount_cent, ...trans }: DbTransaction): Transaction => {
  return {
    ...trans,
    amount: centsToStr(amount_cent),
  };
};

export async function getAll(workbookId: number): Promise<Transaction[]> {
  const { rows } = await db().query<DbTransaction>({
    text: 'select * from transactions where workbook_id = $1',
    values: [workbookId],
  });
  return rows.map(convertTransaction);
}

export async function create(
  workbookId: number,
  { date, type, description, detail, amount, account_from, account_to }: Partial<Transaction>
): Promise<Transaction> {
  const { rows } = await db().query<DbTransaction>({
    text: `insert into transactions(workbook_id, date, type, description, detail, amount_cent, account_from, account_to)
           values($1, $2, $3, $4, $5, $6, $7, $8)
           returning *`,
    values: [workbookId, date, type, description, detail, strToCents(amount || '0'), account_from, account_to],
  });
  return convertTransaction(rows[0]);
}

export async function update(
  workbookId: number,
  { id, date, type, description, detail, amount, account_from, account_to }: Partial<Transaction>
): Promise<Transaction> {
  const { rows } = await db().query<DbTransaction>({
    text: `update transactions
           set date = coalesce($3, date),
               type = coalesce($4, type),
               description = coalesce($5, description),
               detail = coalesce($6, detail),
               amount_cent = coalesce($7, amount_cent)
               account_from = coalesce($8, account_from)
               account_to = coalesce($9, account_to)
           where workbook_id = $1 and id = $2
           returning *`,
    values: [workbookId, id, date, type, description, detail, amount && strToCents(amount), account_from, account_to],
  });
  return convertTransaction(rows[0]);
}

export async function remove(workbookId: number, id: number) {
  await db().query({
    text: 'delete from transactions where workbook_id = $1 and id = $2',
    values: [workbookId, id],
  });
  return { id };
}
