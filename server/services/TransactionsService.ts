import { Inject, Injectable } from '@decorators/di';
import { updateAccounts } from '@shared/calcs';
import { Transaction, WorldUpdate } from '@shared/types';
import { AccountRepository, TransactionRepository } from '../database';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(TransactionRepository) private transactions_: TransactionRepository
  ) {}

  async getAll(workbookId: string) {
    return this.transactions_.getAll(workbookId);
  }

  async processSave(workbookId: string, trans: Transaction): Promise<WorldUpdate> {
    if (!trans) {
      throw 'Save transaction: should have a body';
    }

    if (!trans.type || !trans.description) {
      throw 'Save transaction: should have type and description';
    }

    if (!trans.account_from || !trans.account_to || !trans.amount) {
      throw 'Save transaction: should have from and to accounts, and ammount';
    }

    const oldTrans = trans.id ? await this.transactions_.getById(workbookId, trans.id) : null;
    const trivialUpdate =
      trans.amount === oldTrans?.amount &&
      trans.account_from === oldTrans?.account_from &&
      trans.account_to === oldTrans?.account_to;

    const accIds = [trans.account_from, trans.account_to];
    if (oldTrans) {
      accIds.push(oldTrans.account_from, oldTrans.account_to);
    }

    const accounts = trivialUpdate ? [] : await this.accounts_.getByIds(workbookId, accIds);
    updateAccounts(accounts, [trans], oldTrans ? [oldTrans] : []);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }

    const saved = trans.id
      ? await this.transactions_.update(workbookId, trans)
      : await this.transactions_.create(workbookId, trans);
    return { accounts, transactions: [saved] };
  }

  async processRemoval(workbookId: string, transId: string): Promise<WorldUpdate> {
    const oldTrans = await this.transactions_.getById(workbookId, transId);
    const accounts = await this.accounts_.getByIds(workbookId, [oldTrans.account_from, oldTrans.account_to]);
    updateAccounts(accounts, [], [oldTrans]);
    await this.transactions_.remove(workbookId, transId);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }
    return { accounts, removedTrans: [transId] };
  }
}
