import { Inject, Injectable } from '@decorators/di';
import { updateAccounts } from '@shared/calcs';
import { Account, Transaction, WorldUpdate } from '@shared/types';
import { AccountRepository, TransactionRepository } from '../database';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(TransactionRepository) private transactions_: TransactionRepository
  ) {}

  createUpdate(accounts: Account[], transactions: Transaction[] = [], removedTrans: number[] = []): WorldUpdate {
    return { accounts, transactions, workbooks: [], removedTrans };
  }

  async getAll(workbookId: number) {
    return this.transactions_.getAll(workbookId);
  }

  async processNew(workbookId: number, trans: Transaction): Promise<WorldUpdate> {
    if (!trans || !trans.type || !trans.description) {
      throw 'new transaction should have type and description';
    }

    if (!trans.account_from || !trans.account_to || !trans.amount) {
      throw 'new transaction should have from and to accounts and ammount';
    }

    const accounts = await this.accounts_.getByIds(workbookId, [trans.account_from, trans.account_to]);
    updateAccounts(accounts, [trans], []);
    const created = await this.transactions_.create(workbookId, trans);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }

    return this.createUpdate(accounts, [created]);
  }

  async processUpdate(workbookId: number, trans: Transaction): Promise<WorldUpdate> {
    if (!trans || !trans.id) {
      throw 'update should provide transaction with id';
    }

    const oldTrans = await this.transactions_.getById(workbookId, trans.id);
    trans.amount = trans.amount ?? oldTrans.amount;
    trans.account_from = trans.account_from ?? oldTrans.account_from;
    trans.account_to = trans.account_to ?? oldTrans.account_to;

    if (
      trans.amount === oldTrans.amount &&
      trans.account_from === oldTrans.account_from &&
      trans.account_to === oldTrans.account_to
    ) {
      // trivial metadata change, no balance update
      await this.transactions_.update(workbookId, trans);
      return this.createUpdate([]);
    }

    const accounts = await this.accounts_.getByIds(workbookId, [
      trans.account_from,
      trans.account_to,
      oldTrans.account_from,
      oldTrans.account_to,
    ]);
    updateAccounts(accounts, [trans], [oldTrans]);
    const updated = await this.transactions_.update(workbookId, trans);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }
    return this.createUpdate(accounts, [updated]);
  }

  async processRemoval(workbookId: number, transId: number): Promise<WorldUpdate> {
    const oldTrans = await this.transactions_.getById(workbookId, transId);
    const accounts = await this.accounts_.getByIds(workbookId, [oldTrans.account_from, oldTrans.account_to]);
    updateAccounts(accounts, [], [oldTrans]);
    await this.transactions_.remove(workbookId, transId);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }
    return this.createUpdate(accounts, undefined, [transId]);
  }
}
