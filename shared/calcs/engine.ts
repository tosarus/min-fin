import currency from 'currency.js';
import { Account, CashFlow, FlowDirection, Transaction } from '../types';

export function buildCashFlows(transaction?: Transaction): CashFlow[] {
  if (!transaction) {
    return [];
  }

  const transactionInfo = {
    workbook_id: transaction.workbook_id,
    transaction_id: transaction.id,
    date: transaction.date,
    type: transaction.type,
    description: transaction.description,
    detail: transaction.detail,
    order: transaction.order,
  };

  const fromFlow: CashFlow = {
    ...transactionInfo,
    direction: FlowDirection.From,
    amount: currency(transaction.amount).multiply(-1).format(),
    account_id: transaction.account_from,
    other_account_id: transaction.account_to,
    balance: currency(0).format(),
  };

  const toFlow: CashFlow = {
    ...transactionInfo,
    direction: FlowDirection.To,
    amount: transaction.amount,
    account_id: transaction.account_to,
    other_account_id: transaction.account_from,
    balance: currency(0).format(),
  };

  return [fromFlow, toFlow];
}

export function updateAccounts(accounts: Account[], addFlows: CashFlow[], removeFlows: CashFlow[]) {
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
