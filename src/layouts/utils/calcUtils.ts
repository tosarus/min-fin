import currency from 'currency.js';
import { Account, AccountType, CashFlow, TransactionType } from '../../types';

export function getTotalForAccounts(accounts: Account[], ...types: AccountType[]) {
  return calcucateSum(accounts.filter((acc) => types.includes(acc.type)).map((acc) => acc.balance));
}

export function calculateTotals(cashFlows: CashFlow[], type: TransactionType) {
  const totals = new Map<string, currency>();
  const updateTotals = (id: string, amount: string) => totals.set(id, (totals.get(id) ?? currency(0)).add(amount));

  cashFlows.filter((flow) => flow.type === type).forEach((flow) => updateTotals(flow.other_account_id, flow.amount));
  return new Map<string, string>(Array.from(totals.entries(), (v) => [v[0], v[1].format()]));
}

export function calcucateSum(values: string[]) {
  return values.reduce((sum, v) => sum.add(v), currency(0)).format();
}

export const amountOrZero = (amount?: string) => currency(amount ?? 0).format();

export const positiveValue = (amount: string) => Math.abs(currency(amount).value);

export const positiveAmount = (amount: string | number) => {
  let value = currency(amount);
  if (value.intValue < 0) {
    value = value.multiply(-1);
  }
  return value.format();
};

export const negateAmount = (amount: string | number) => currency(amount).multiply(-1).format();
