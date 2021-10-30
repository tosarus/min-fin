import currency from 'currency.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { CashFlow, TransactionType } from '../../types';

dayjs.extend(isBetween);

export function withinMonthFilter(month: string) {
  const from = dayjs(month);
  const to = from.add(1, 'month');
  return ({ date }: { date: string }) => dayjs(date).isBetween(from, to, 'day', '[)');
}

export function calculateTotals(cashFlows: CashFlow[], type: TransactionType) {
  const totals = new Map<string, currency>();
  const updateTotals = (id: string, amount: string) => totals.set(id, (totals.get(id) ?? currency(0)).add(amount));

  cashFlows.filter((flow) => flow.type === type).forEach((flow) => updateTotals(flow.other_account_id, flow.amount));
  return new Map<string, string>(Array.from(totals.entries(), (v) => [v[0], v[1].format()]));
}

export function calcucateSum(values: string[], options?: { makeNegative?: boolean }) {
  return values
    .reduce((summ, v) => summ.add(v), currency(0))
    .multiply(options?.makeNegative ? -1 : 1)
    .format();
}

export function sameMonthFilter(month: string) {
  const m = dayjs(month);
  return (v: { month: string }) => m.isSame(v.month, 'month');
}

export function getCurrentMonth() {
  return dayjs().startOf('month').format('YYYY-MM-DD');
}

export function fractionOfMonth(month: string) {
  const now = dayjs();
  if (now.isSame(month, 'month')) {
    return now.date() / dayjs(month).endOf('month').date();
  } else {
    return 0;
  }
}
