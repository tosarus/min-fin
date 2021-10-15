import { Injectable } from '@decorators/di';
import { centsToStr, strToCents } from '@shared/calcs';
import { Account, AccountType } from '@shared/types';
import db from '../db';

type DbAccount = {
  id: string;
  workbook_id: string;
  name: string;
  type: AccountType;
  parent_id: string;
  is_group: boolean;
  balance_cent: number;
};

const convertAccount = ({ balance_cent, ...account }: DbAccount): Account => {
  return {
    ...account,
    balance: centsToStr(balance_cent),
  };
};

@Injectable()
export class AccountRepository {
  async getForWorkbook(workbookId: string): Promise<Account[]> {
    const { rows } = await db().query<DbAccount>({
      text: 'select * from accounts where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertAccount);
  }

  async getByIds(workbookId: string, ids: string[]): Promise<Account[]> {
    const { rows } = await db().query<DbAccount>({
      text: 'select * from accounts where workbook_id = $1 and id = ANY($2::uuid[])',
      values: [workbookId, ids],
    });
    return rows.map(convertAccount);
  }

  async create(workbookId: string, account: Partial<Account>): Promise<Account> {
    const { name, type, parent_id, is_group = false } = account;
    const { rows } = await db().query<DbAccount>({
      text: `
insert into accounts(workbook_id, name, type, parent_id, is_group, balance_cent)
values($1, $2, $3, $4, $5, 0)
returning *`,
      values: [workbookId, name, type, parent_id, is_group],
    });
    return convertAccount(rows[0]);
  }

  async update(workbookId: string, account: Partial<Account>): Promise<Account> {
    const { id, name, type, parent_id, is_group, balance } = account;
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

  async remove(workbookId: string, id: string) {
    await db().query({
      text: 'delete from accounts where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
  }
}
