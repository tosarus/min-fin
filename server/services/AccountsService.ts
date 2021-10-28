import { Service } from 'typedi';
import { Account, AccountType, getPublicAccountTypes, WorldUpdate } from '@shared/types';
import { AccountRepository, TransactionRepository } from '../repositories';
import { BaseService } from './BaseService';

@Service()
export class AccountsService extends BaseService {
  async getAll(workbookId: string) {
    return await this.resolve(AccountRepository).getForWorkbook(workbookId);
  }

  async save(workbookId: string, account: Partial<Account>) {
    if (!account) {
      throw 'Save account: should have a body';
    }

    if (!account.name || !account.type) {
      throw 'Save account: should provide name and type';
    }

    if (!getPublicAccountTypes().includes(account.type)) {
      throw 'Save account: type should be allowed';
    }

    if (account.id) {
      return await this.resolve(AccountRepository).update(workbookId, account);
    } else {
      return await this.resolve(AccountRepository).create(workbookId, account);
    }
  }

  async removeIfEmpty(workbookId: string, id: string) {
    const accountRepo = this.resolve(AccountRepository);
    const transactionRepo = this.resolve(TransactionRepository);

    const children = await accountRepo.getByParentId(workbookId, id);
    if (children.length !== 0) {
      return;
    }

    const trans = await transactionRepo.findByAccountId(workbookId, id);
    if (trans.length !== 0) {
      return;
    }

    await accountRepo.remove(workbookId, id);
  }

  async remove(workbookId: string, id: string): Promise<WorldUpdate> {
    const accountRepo = this.resolve(AccountRepository);
    const updated = await accountRepo.update(workbookId, { id, type: AccountType.Removed });
    // running async, removed accounts are not shown, but used if transactions exist, so
    // if no transactions => account removal will be pick up on next resync
    // else (if transactions present) => no action
    this.removeIfEmpty(workbookId, id).catch(console.log);
    return { accounts: [updated] };
  }
}
