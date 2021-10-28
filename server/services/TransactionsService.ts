import { Service } from 'typedi';
import { buildCashFlows, getMinDate, updateAccounts } from '@shared/calcs';
import { Account, CashFlowId, getAssetAccountTypes, Transaction, WorldUpdate } from '@shared/types';
import { AccountRepository, CashFlowRepository, TransactionRepository } from '../repositories';
import { BaseService } from './BaseService';
import { InTransaction } from './InTransaction';

@Service()
export class TransactionsService extends BaseService {
  async getAll(workbookId: string) {
    return this.resolve(TransactionRepository).getAll(workbookId);
  }

  @InTransaction()
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

    const transactionRepo = this.resolve(TransactionRepository);

    const oldTrans = trans.id ? [await transactionRepo.getById(workbookId, trans.id)] : [];
    const newTrans = trans.id
      ? await transactionRepo.update(workbookId, trans)
      : await transactionRepo.create(workbookId, trans);

    const update = await this.updateAccounts(workbookId, [newTrans], oldTrans);

    return { ...update, transactions: [newTrans] };
  }

  @InTransaction()
  async processRemoval(workbookId: string, transId: string): Promise<WorldUpdate> {
    const transactionRepo = this.resolve(TransactionRepository);

    const oldTrans = await transactionRepo.getById(workbookId, transId);

    const update = await this.updateAccounts(workbookId, [], [oldTrans]);

    await transactionRepo.remove(workbookId, transId);

    return { ...update, removedTrans: [transId] };
  }

  @InTransaction()
  async generateCashFlows(workbookId: string): Promise<WorldUpdate> {
    const transactionRepo = this.resolve(TransactionRepository);
    const transList = await transactionRepo.getAll(workbookId);
    return await this.updateAccounts(workbookId, transList, []);
  }

  private async updateAccounts(workbookId: string, newTrans: Transaction[], oldTrans: Transaction[]): Promise<WorldUpdate> {
    const accountRepo = this.resolve(AccountRepository);
    const cashFlowRepo = this.resolve(CashFlowRepository);

    const assetAccounts = await accountRepo.getByTypes(workbookId, getAssetAccountTypes());
    const accountIds = new Set<string>(assetAccounts.map((acc) => acc.id));

    const flowsToAdd = buildCashFlows(newTrans).filter((flow) => accountIds.has(flow.account_id));
    const flowsToRemove = buildCashFlows(oldTrans).filter((flow) => accountIds.has(flow.account_id));

    const updatedIds = updateAccounts(assetAccounts, flowsToAdd, flowsToRemove);
    const accounts = [] as Account[];
    for (const acc of assetAccounts.filter((acc) => updatedIds.has(acc.id))) {
      accounts.push(await accountRepo.update(workbookId, acc));
    }

    const updatedFlows = new Set<string>();
    for (const flow of flowsToAdd) {
      await cashFlowRepo.save(flow);
      updatedFlows.add(flow.transaction_id + flow.account_id);
    }

    const removedFlows = [] as CashFlowId[];
    for (const flow of flowsToRemove.filter((flow) => !updatedFlows.has(flow.transaction_id + flow.account_id))) {
      await cashFlowRepo.remove(flow);
      removedFlows.push([flow.transaction_id, flow.account_id]);
    }

    const minDate = oldTrans
      .concat(newTrans)
      .map((trans) => trans.date)
      .reduce(getMinDate, new Date().toISOString());
    const cashFlows = await cashFlowRepo.findAfterDate(workbookId, [...updatedIds], minDate);

    return { accounts, cashFlows, removedFlows };
  }
}
