import { centsToStr, strToCents } from '@shared/calcs';
import { Account, AccountType } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

type DbAccount = {
  id: string;
  workbook_id: string;
  name: string;
  type: AccountType;
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
    const { name, type } = account;
    const { rows } = await this.qm().query<DbAccount>({
      name: 'accounts-create',
      text: `
insert into accounts(workbook_id, name, type, balance_cent)
values($1, $2, $3, 0)
returning *`,
      values: [workbookId, name, type],
    });
    return convertAccount(rows[0]);
  }

  async update(workbookId: string, account: Partial<Account>): Promise<Account> {
    const { id, name, type, balance } = account;
    const { rows } = await this.qm().query<DbAccount>({
      name: 'accounts-update',
      text: `
update accounts
set name = coalesce($3, name),
    type = coalesce($4, type),
    balance_cent = coalesce($5, balance_cent)
where workbook_id = $1 and id = $2
returning *`,
      values: [workbookId, id, name, type, balance && strToCents(balance)],
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
