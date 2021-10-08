import { Injectable } from '@decorators/di';
import { Account, AccountType } from '@shared/types';
import { centsToStr, strToCents } from './utils';
import db from '../db';

type DbAccount = {
  id: number;
  workbook_id: number;
  name: string;
  type: AccountType;
  parent_id: number;
  is_group: boolean;
  balance_cent: number;
};

const convertAccount = ({ balance_cent, ...account }: DbAccount): Account => {
  return {
    ...account,
    balance: centsToStr(balance_cent),
  };
};

export { Account };

@Injectable()
export class AccountRepository {
  async getForWorkbook(workbookId: number): Promise<Account[]> {
    const { rows } = await db().query<DbAccount>({
      text: 'select * from accounts where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertAccount);
  }

  async create(workbookId: number, { name, type, parent_id, is_group, balance }: Partial<Account>): Promise<Account> {
    const { rows } = await db().query<DbAccount>({
      text: `
insert into accounts(workbook_id, name, type, parent_id, is_group, balance_cent)
values($1, $2, $3, $4, $5, $6)
returning *`,
      values: [workbookId, name, type, parent_id, is_group ?? false, strToCents(balance ?? '0')],
    });
    return convertAccount(rows[0]);
  }

  async update(workbookId: number, { id, name, type, parent_id, is_group, balance }: Partial<Account>): Promise<Account> {
    const { rows } = await db().query<DbAccount>({
      text: `
update accounts
set name = coalesce($3, name),
    type = coalesce($4, type),
    parent_id = coalesce($5, parent_id),
    is_group = coalesce($6, is_group),
    balance_cent = coalesce($7, balance_cent)
where workbook_id = $1 and id = $2
returning *`,
      values: [workbookId, id, name, type, parent_id, is_group, balance && strToCents(balance)],
    });
    return convertAccount(rows[0]);
  }

  async remove(workbookId: number, id: number) {
    await db().query({
      text: 'delete from accounts where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
    return { workbookId, id };
  }
}
