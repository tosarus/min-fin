import { Service } from 'typedi';
import { buildCashFlows, updateAccounts } from '@shared/calcs';
import { CashFlowId, Transaction, WorldUpdate } from '@shared/types';
import { AccountRepository, CashFlowRepository, TransactionRepository } from '../repositories';
import { BaseService, InTransaction } from './di';

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

    const accountRepo = this.resolve(AccountRepository);
    const cashFlowRepo = this.resolve(CashFlowRepository);
    const transactionRepo = this.resolve(TransactionRepository);

    const oldTrans = trans.id ? await transactionRepo.getById(workbookId, trans.id) : undefined;

    const flowsToAdd = buildCashFlows(trans);
    const flowsToRemove = buildCashFlows(oldTrans);

    const accIds = flowsToAdd.concat(flowsToRemove).map((flow) => flow.account_id);
    const accounts = await accountRepo.getByIds(workbookId, accIds);
    updateAccounts(accounts, flowsToAdd, flowsToRemove);
    for (const acc of accounts) {
      await accountRepo.update(workbookId, acc);
    }

    const saved = trans.id
      ? await transactionRepo.update(workbookId, trans)
      : await transactionRepo.create(workbookId, trans);

    const removedFlows = [] as CashFlowId[];
    for (const flow of flowsToRemove) {
      await cashFlowRepo.remove(flow);
      removedFlows.push([flow.transaction_id, flow.account_id]);
    }

    for (const flow of flowsToAdd) {
      flow.transaction_id = saved.id;
      flow.workbook_id = workbookId;
      await cashFlowRepo.save(flow);
    }

    const cashFlows = await cashFlowRepo.findAfterDate(workbookId, accIds, saved.date);
    return { accounts, cashFlows, transactions: [saved], removedFlows };
  }

  @InTransaction()
  async processRemoval(workbookId: string, transId: string): Promise<WorldUpdate> {
    const accountRepo = this.resolve(AccountRepository);
    const cashFlowRepo = this.resolve(CashFlowRepository);
    const transactionRepo = this.resolve(TransactionRepository);

    const oldTrans = await transactionRepo.getById(workbookId, transId);

    const removeFlows = buildCashFlows(oldTrans);

    const accIds = removeFlows.map((flow) => flow.account_id);
    const accounts = await accountRepo.getByIds(workbookId, accIds);
    updateAccounts(accounts, [], removeFlows);
    for (const acc of accounts) {
      await accountRepo.update(workbookId, acc);
    }

    for (const flow of removeFlows) {
      await cashFlowRepo.remove(flow);
    }

    await transactionRepo.remove(workbookId, transId);

    const cashFlows = await cashFlowRepo.findAfterDate(workbookId, accIds, oldTrans.date);
    return { accounts, cashFlows, removedTrans: [transId] };
  }
}
