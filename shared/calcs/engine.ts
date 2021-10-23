import currency from 'currency.js';
import { Account, FlowDirection, Transaction } from '../types';

export interface FlatCashFlow {
  workbook_id: string;
  transaction_id: string;
  account_id: string;
  other_account_id: string;
  direction: FlowDirection;
  amount: string;
}

export function buildCashFlows(transactionList: Transaction[]): FlatCashFlow[] {
  const cashFlowList = [] as FlatCashFlow[];
  transactionList.forEach((transaction) => {
    const fromFlow: FlatCashFlow = {
      workbook_id: transaction.workbook_id,
      transaction_id: transaction.id,
      direction: FlowDirection.From,
      amount: currency(transaction.amount).multiply(-1).format(),
      account_id: transaction.account_from,
      other_account_id: transaction.account_to,
    };

    const toFlow: FlatCashFlow = {
      workbook_id: transaction.workbook_id,
      transaction_id: transaction.id,
      direction: FlowDirection.To,
      amount: transaction.amount,
      account_id: transaction.account_to,
      other_account_id: transaction.account_from,
    };
    cashFlowList.push(fromFlow, toFlow);
  });
  return cashFlowList;
}

export function updateAccounts(accounts: Account[], addFlows: FlatCashFlow[], removeFlows: FlatCashFlow[]): Set<string> {
  const updatedIds = new Set<string>();
  if (accounts.length == 0) {
    return updatedIds;
  }

  const accMap = new Map<string, Account>();
  accounts.forEach((acc) => accMap.set(acc.id, acc));

  removeFlows.forEach((flow) => {
    const acc = accMap.get(flow.account_id);
    if (acc) {
      acc.balance = currency(acc.balance).subtract(flow.amount).format();
      updatedIds.add(acc.id);
    }
  });

  addFlows.forEach((flow) => {
    const acc = accMap.get(flow.account_id);
    if (acc) {
      acc.balance = currency(acc.balance).add(flow.amount).format();
      updatedIds.add(acc.id);
    }
  });

  return updatedIds;
}
