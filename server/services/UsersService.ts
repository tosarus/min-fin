import { Inject, Injectable } from '@decorators/di';
import { AccountType, UserInfo, WorldUpdate } from '@shared/types';
import { AccountRepository, isAdmin, TransactionRepository, UserRepository, WorkbookRepository } from '../database';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(TransactionRepository) private transactions_: TransactionRepository,
    @Inject(UserRepository) private users_: UserRepository,
    @Inject(WorkbookRepository) private workbooks_: WorkbookRepository
  ) {}

  async getOrAdd(email: string, creator: (email: string) => Promise<Partial<UserInfo>>): Promise<UserInfo> {
    return (await this.users_.findByEmail(email)) || (await this.users_.create(await creator(email)));
  }

  async list(email: string) {
    return isAdmin(email) ? await this.users_.getAll() : [await this.users_.findByEmail(email)];
  }

  async update(email: string, user: Partial<UserInfo>) {
    user.email = user.email ?? email;

    if (!isAdmin(email)) {
      if (user.email !== email) {
        throw 'Can`t update info for other user';
      }
      delete user.allowed;
    }

    const needWorldUpdate = !!user.active_workbook;
    const profile = await this.users_.update(user.email, user);
    if (needWorldUpdate) {
      return await this.getWorldUpdate(profile);
    } else {
      return { profile, accounts: [], transactions: [], workbooks: [], removedTrans: [] };
    }
  }

  async getWorldUpdate(profile: UserInfo): Promise<WorldUpdate> {
    if (!profile.allowed) {
      return { accounts: [], transactions: [], workbooks: [], removedTrans: [] };
    }

    if (!profile.active_workbook) {
      const workbook = await this.workbooks_.create(profile.email, { name: 'Default' });
      profile.active_workbook = workbook.id;
      await this.users_.update(profile.email, { active_workbook: workbook.id });
    }

    const accounts = await this.accounts_.getForWorkbook(profile.active_workbook);
    if (accounts.filter((acc) => acc.type === AccountType.Opening).length === 0) {
      const openingAccount = await this.accounts_.create(profile.active_workbook, {
        type: AccountType.Opening,
        name: 'Starting Balaces (hidden)',
      });
      accounts.push(openingAccount);
    }
    const transactions = await this.transactions_.getAll(profile.active_workbook);
    const workbooks = await this.workbooks_.getAll(profile.email);
    return { profile, accounts, transactions, workbooks, removedTrans: [] };
  }
}
