import { Inject, Injectable } from '@decorators/di';
import { Account, AccountType, userLevelAccounts, WorldUpdate } from '@shared/types';
import { AccountRepository, TransactionRepository } from '../database/';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(TransactionRepository) private transactions_: TransactionRepository
  ) {}

  async getAll(workbookId: string) {
    return await this.accounts_.getForWorkbook(workbookId);
  }

  async save(workbookId: string, account: Partial<Account>) {
    if (!account) {
      throw 'Save account: should have a body';
    }

    if (!account.name || !account.type) {
      throw 'Save account: should provide name and type';
    }

    if (!userLevelAccounts().includes(account.type)) {
      throw 'Save account: type should be allowed';
    }

    if (account.id) {
      return await this.accounts_.update(workbookId, account);
    } else {
      return await this.accounts_.create(workbookId, account);
    }
  }

  async removeIfEmpty(workbookId: string, id: string) {
    const trans = await this.transactions_.findByAccountId(workbookId, id);
    if (trans.length === 0) {
      await this.accounts_.remove(workbookId, id);
    }
  }

  async remove(workbookId: string, id: string): Promise<WorldUpdate> {
    const updated = await this.accounts_.update(workbookId, { id, type: AccountType.Removed, name: '(removed)' });
    // running async, removed accounts are not shown, but used if transactions exist, so
    // if no transactions => account removal will be pick up on next resync
    // else (if transactions present) => no action
    this.removeIfEmpty(workbookId, id).catch(console.log);
    return { accounts: [updated], transactions: [], removedTrans: [], workbooks: [] };
  }
}
