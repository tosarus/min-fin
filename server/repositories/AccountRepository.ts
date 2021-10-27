import { centsToStr, strToCents } from '@shared/calcs';
import { Account, AccountType } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

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

export class AccountRepository extends AbstractRepository {
  async getForWorkbook(workbookId: string): Promise<Account[]> {
    const { rows } = await this.qm().query<DbAccount>({
      text: 'select * from accounts where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertAccount);
  }

  async getByIds(workbookId: string, ids: string[]): Promise<Account[]> {
    const { rows } = await this.qm().query<DbAccount>({
      text: 'select * from accounts where workbook_id = $1 and id = ANY($2::uuid[])',
      values: [workbookId, ids],
    });
    return rows.map(convertAccount);
  }

  async getByTypes(workbookId: string, types: AccountType[]): Promise<Account[]> {
    const { rows } = await this.qm().query<DbAccount>({
      text: 'select * from accounts where workbook_id = $1 and type = ANY ($2::text[])',
      values: [workbookId, types],
    });
    return rows.map(convertAccount);
  }

  async create(workbookId: string, account: Partial<Account>): Promise<Account> {
    const { name, type, parent_id } = account;
    const { rows } = await this.qm().query<DbAccount>({
      name: 'accounts-create',
      text: `
insert into accounts(workbook_id, name, type, parent_id, is_group, balance_cent)
values($1, $2, $3, $4, False, 0)
returning *`,
      values: [workbookId, name, type, parent_id],
    });
    return convertAccount(rows[0]);
  }

  async update(workbookId: string, account: Partial<Account>): Promise<Account> {
    const { id, name, type, parent_id, balance } = account;
    const { rows } = await this.qm().query<DbAccount>({
      name: 'accounts-update',
      text: `
update accounts
set name = $3,
    type = $4,
    parent_id = $5,
    balance_cent = coalesce($6, balance_cent)
where workbook_id = $1 and id = $2
returning *`,
      values: [workbookId, id, name, type, parent_id, balance && strToCents(balance)],
    });
    return convertAccount(rows[0]);
  }

  async remove(workbookId: string, id: string) {
    await this.qm().query({
      text: 'delete from accounts where workbook_id = $1 and id = $2',
      values: [workbookId, id],
    });
  }

  async removeByWorkbook(workbookId: string) {
    await this.qm().query({
      text: 'delete from accounts where workbook_id = $1',
      values: [workbookId],
    });
  }
}
