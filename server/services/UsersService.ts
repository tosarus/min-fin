import { Inject, Injectable } from '@decorators/di';
import { AccountType, UserInfo, WorldUpdate } from '@shared/types';
import { isAdmin, QueryManager } from '../database';
import {
  AccountRepository,
  CashFlowRepository,
  TransactionRepository,
  UserRepository,
  WorkbookRepository,
} from '../repositories';
import { BaseService } from './di';

@Injectable()
export class UsersService extends BaseService {
  constructor(@Inject(QueryManager) qm: QueryManager) {
    super(qm);
  }

  async getOrAdd(email: string, creator: (email: string) => Promise<Partial<UserInfo>>): Promise<UserInfo> {
    const repository = this.resolve(UserRepository);
    return (await repository.findByEmail(email)) || (await repository.create(await creator(email)));
  }

  async list(email: string) {
    const repository = this.resolve(UserRepository);
    return isAdmin(email) ? await repository.getAll() : [await repository.findByEmail(email)];
  }

  async update(email: string, user: Partial<UserInfo>) {
    const repository = this.resolve(UserRepository);
    user.email = user.email ?? email;

    if (!isAdmin(email)) {
      if (user.email !== email) {
        throw 'Can`t update info for other user';
      }
      delete user.allowed;
    }

    const needWorldUpdate = !!user.active_workbook;
    const profile = await repository.update(user.email, user);
    if (needWorldUpdate) {
      return await this.getWorldUpdate(profile);
    } else {
      return { profile };
    }
  }

  async getWorldUpdate(profile: UserInfo): Promise<WorldUpdate> {
    if (!profile.allowed) {
      return { profile };
    }

    const accountRepo = this.resolve(AccountRepository);
    const cashFlowRepo = this.resolve(CashFlowRepository);
    const transRepo = this.resolve(TransactionRepository);
    const userRepo = this.resolve(UserRepository);
    const workbookRepo = this.resolve(WorkbookRepository);

    if (!profile.active_workbook) {
      const workbook = await workbookRepo.create(profile.email, { name: 'Default' });
      profile.active_workbook = workbook.id;
      await userRepo.update(profile.email, { active_workbook: workbook.id });
    }

    const accounts = await accountRepo.getForWorkbook(profile.active_workbook);
    if (accounts.filter((acc) => acc.type === AccountType.Opening).length === 0) {
      const openingAccount = await accountRepo.create(profile.active_workbook, {
        type: AccountType.Opening,
        name: 'Starting Balaces (hidden)',
      });
      accounts.push(openingAccount);
    }
    const cashFlows = await cashFlowRepo.getAll(profile.active_workbook);
    const transactions = await transRepo.getAll(profile.active_workbook);
    const workbooks = await workbookRepo.getAll(profile.email);
    return { profile, accounts, cashFlows, transactions, workbooks };
  }
}
