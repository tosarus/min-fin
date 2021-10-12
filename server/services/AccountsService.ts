import { Inject, Injectable } from '@decorators/di';
import { Account, AccountType, userLevelAccounts, WorldUpdate } from '@shared/types';
import { AccountRepository, TransactionRepository } from '../database/';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(TransactionRepository) private transactions_: TransactionRepository
  ) {}

  async getAll(workbookId: number) {
    return await this.accounts_.getForWorkbook(workbookId);
  }

  async create(worbookId: number, account: Partial<Account>) {
    if (!account || !account.name || !account.type) {
      throw 'New account: should provide name and type';
    }

    if (!userLevelAccounts().includes(account.type)) {
      throw 'New account: type should be allowed';
    }

    delete account.id;
    delete account.workbook_id;
    delete account.balance;

    return this.accounts_.create(worbookId, account);
  }

  async update(workbookId: number, account: Partial<Account>) {
    if (!account || !account.id) {
      throw 'Upate account: should provide id';
    }

    if (account.type && !userLevelAccounts().includes(account.type)) {
      throw 'Upate account: type should be allowed';
    }

    delete account.workbook_id;

    return this.accounts_.update(workbookId, account);
  }

  async removeIfEmpty(workbookId: number, id: number) {
    const trans = await this.transactions_.findByAccountId(workbookId, id);
    if (trans.length === 0) {
      await this.accounts_.remove(workbookId, id);
    }
  }

  async remove(workbookId: number, id: number): Promise<WorldUpdate> {
    const updated = await this.accounts_.update(workbookId, { id, type: AccountType.Removed, name: '(removed)' });
    // running async, removed accounts are not shown, but used if transactions exist, so
    // if no transactions => account removal will be pick up on next resync
    // else (if transactions present) => no action
    this.removeIfEmpty(workbookId, id).catch(console.log);
    return { accounts: [updated], transactions: [], removedTrans: [], workbooks: [] };
  }
}
