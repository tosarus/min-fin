import currency from 'currency.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Account, CashFlow } from '../../types';

dayjs.extend(isBetween);

export function getCategoryAmout(
  cashFlows: CashFlow[],
  accId: string,
  month: string | undefined,
  accMap: Map<string, Account>
) {
  const from = month ? dayjs(month) : undefined;
  const to = from?.add(1, 'month');
  return cashFlows
    .filter(
      (flow) =>
        (flow.other_account_id === accId || accMap.get(flow.other_account_id)?.parent_id === accId) &&
        (!month || dayjs(flow.date).isBetween(from, to, 'day', '[)'))
    )
    .reduce((amount, flow) => amount.add(flow.amount), currency(0))
    .format();
}
