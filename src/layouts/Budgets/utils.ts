import currency from 'currency.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Account, CashFlow } from '../../types';

dayjs.extend(isBetween);

function withinMonth(month: string) {
  const from = dayjs(month);
  const to = from.add(1, 'month');
  return ({ date }: { date: string }) => dayjs(date).isBetween(from, to, 'day', '[)');
}

export function calculateTotals(cashFlows: CashFlow[], month: string, accMap: Map<string, Account>) {
  const totals = new Map<string, currency>();
  const updateTotals = (id: string, amount: string | currency) =>
    totals.set(id, (totals.get(id) ?? currency(0)).add(amount));

  cashFlows.filter(withinMonth(month)).forEach((flow) => updateTotals(flow.other_account_id, flow.amount));
  for (const accValue of totals) {
    const acc = accMap.get(accValue[0]);
    if (acc?.parent_id) {
      updateTotals(acc.parent_id, accValue[1]);
    }
  }

  return new Map<string, string>(Array.from(totals.entries(), (v) => [v[0], v[1].format()]));
}

export function sameMonthFilter(month: string) {
  const m = dayjs(month);
  return (v: { month: string }) => m.isSame(v.month, 'month');
}

export function getCurrentMonth() {
  return dayjs().startOf('month').format('YYYY-MM-DD');
}
