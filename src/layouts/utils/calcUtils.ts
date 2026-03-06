import currency from 'currency.js';
import { Account, AccountType, CashFlow } from '../../types';
import { parseTags } from '../Contract';
import { getFlowAccountFilter } from './accountUtils';
import { sameYearFilter, withinMonthFilter } from './dateUtils';

export function getTotalForAccounts(accounts: Account[], ...types: AccountType[]) {
  return calculateSum(accounts.filter((acc) => types.includes(acc.type)).map((acc) => acc.balance));
}

export function calculateTotals(cashFlows: CashFlow[]) {
  const totals = new Map<string, currency>();
  const updateTotals = (id: string, amount: string) => totals.set(id, (totals.get(id) ?? currency(0)).add(amount));

  cashFlows.forEach((flow) => updateTotals(flow.other_account_id, flow.amount));
  return new Map<string, string>(Array.from(totals.entries(), (v) => [v[0], v[1].format()]));
}

export function calculateTagged(cashFlows: CashFlow[]) {
  const tagged = new Map<string, currency>();
  const updateTagged = (tag: string, amount: string) => {
    const tags = parseTags(tag);
    tags.forEach((t) => tagged.set(t, (tagged.get(t) ?? currency(0)).add(amount)));
  };

  cashFlows.filter((flow) => flow.tag).forEach((flow) => updateTagged(flow.tag, flow.amount));
  return new Map<string, string>(Array.from(tagged.entries(), (v) => [v[0], v[1].format()]));
}

export function calculateSum(values: string[]) {
  return values.reduce((sum, v) => sum.add(v), currency(0)).format();
}

export function subtractAmount(valueFrom: string, valueDiff: string) {
  return currency(valueFrom).subtract(valueDiff).format();
}

export function calculatePending(cashFlows: CashFlow[], account: Account) {
  return calculateSum(
    cashFlows
      .filter(getFlowAccountFilter(account.type, account.id))
      .filter((flow) => flow.pending)
      .map((flow) => flow.amount)
  );
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

export function filterMonthCashFlows(cashFlows: CashFlow[], account: Account, month?: string) {
  cashFlows = month ? cashFlows.filter(withinMonthFilter(month)) : cashFlows.filter(sameYearFilter());
  return cashFlows.filter(getFlowAccountFilter(account.type, account.id));
}

export function calculateExpenses(cashFlows: CashFlow[], account: Account, month?: string) {
  return calculateSum(filterMonthCashFlows(cashFlows, account, month).map((flow) => flow.amount));
}

export function calculateTaggedExpenses(cashFlows: CashFlow[], account: Account, month?: string) {
  return calculateTagged(filterMonthCashFlows(cashFlows, account, month));
}
