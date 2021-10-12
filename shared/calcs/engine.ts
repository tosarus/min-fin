import currency from 'currency.js';
import { Account, Transaction } from '../types';

interface CashFlow {
  account: number;
  amount: string;
}

export function updateAccounts(accounts: Account[], newTrans: Transaction[], oldTrans: Transaction[]) {
  const toAdd: CashFlow[] = [];
  const toSubstract: CashFlow[] = [];

  for (const { account_from, account_to, amount } of oldTrans) {
    toAdd.push({ account: account_from, amount });
    toSubstract.push({ account: account_to, amount: amount });
  }

  for (const { account_from, account_to, amount } of newTrans) {
    toAdd.push({ account: account_to, amount });
    toSubstract.push({ account: account_from, amount });
  }

  const accMap = new Map<number, Account>();
  accounts.forEach((acc) => accMap.set(acc.id, acc));

  toSubstract.forEach((flow) => {
    const acc = accMap.get(flow.account);
    acc!.balance = currency(acc!.balance).subtract(flow.amount).format();
  });

  toAdd.forEach((flow) => {
    const acc = accMap.get(flow.account);
    acc!.balance = currency(acc!.balance).add(flow.amount).format();
  });
}
