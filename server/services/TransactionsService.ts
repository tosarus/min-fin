import { Inject, Injectable } from '@decorators/di';
import { buildCashFlows, updateAccounts } from '@shared/calcs';
import { Transaction, WorldUpdate } from '@shared/types';
import { AccountRepository, CashFlowRepository, TransactionRepository } from '../database';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(CashFlowRepository) private cashFlows_: CashFlowRepository,
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

    const oldTrans = trans.id ? await this.transactions_.getById(workbookId, trans.id) : undefined;

    const addFlows = buildCashFlows(trans);
    const removeFlows = buildCashFlows(oldTrans);

    const accIds = addFlows.concat(removeFlows).map((flow) => flow.account_id);
    const accounts = await this.accounts_.getByIds(workbookId, accIds);
    updateAccounts(accounts, addFlows, removeFlows);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }

    const saved = trans.id
      ? await this.transactions_.update(workbookId, trans)
      : await this.transactions_.create(workbookId, trans);

    for (const flow of removeFlows) {
      await this.cashFlows_.remove(flow);
    }
    for (const flow of addFlows) {
      flow.transaction_id = saved.id;
      flow.workbook_id = workbookId;
      await this.cashFlows_.save(flow);
    }

    const cashFlows = await this.cashFlows_.findAfterDate(workbookId, accIds, saved.date);
    return { accounts, cashFlows, transactions: [saved] };
  }

  async processRemoval(workbookId: string, transId: string): Promise<WorldUpdate> {
    const oldTrans = await this.transactions_.getById(workbookId, transId);

    const removeFlows = buildCashFlows(oldTrans);

    const accIds = removeFlows.map((flow) => flow.account_id);
    const accounts = await this.accounts_.getByIds(workbookId, accIds);
    updateAccounts(accounts, [], removeFlows);
    for (const acc of accounts) {
      await this.accounts_.update(workbookId, acc);
    }

    for (const flow of removeFlows) {
      await this.cashFlows_.remove(flow);
    }

    await this.transactions_.remove(workbookId, transId);

    const cashFlows = await this.cashFlows_.findAfterDate(workbookId, accIds, oldTrans.date);
    return { accounts, cashFlows, removedTrans: [transId] };
  }
}
