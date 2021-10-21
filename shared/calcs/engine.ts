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

export function buildCashFlows(transaction?: Transaction): FlatCashFlow[] {
  if (!transaction) {
    return [];
  }

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

  return [fromFlow, toFlow];
}

export function updateAccounts(accounts: Account[], addFlows: FlatCashFlow[], removeFlows: FlatCashFlow[]) {
  if (accounts.length == 0) {
    return;
  }

  const accMap = new Map<string, Account>();
  accounts.forEach((acc) => accMap.set(acc.id, acc));

  removeFlows.forEach((flow) => {
    const acc = accMap.get(flow.account_id);
    acc!.balance = currency(acc!.balance).subtract(flow.amount).format();
  });

  addFlows.forEach((flow) => {
    const acc = accMap.get(flow.account_id);
    acc!.balance = currency(acc!.balance).add(flow.amount).format();
  });
}
