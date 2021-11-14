import { centsToStr, FlatCashFlow, sanitizeDate, strToCents } from '@shared/calcs';
import { CashFlow, FlowDirection, TransactionType } from '@shared/types';
import { AbstractRepository } from './AbstractRepository';

type DbCashFlow = {
  workbook_id: string;
  transaction_id: string;
  account_id: string;
  other_account_id: string;
  to_flow: boolean;
  amount_cent: number;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  order: number;
  balance_cent: number;
  pending: boolean;
};

const convertCashFlow = ({ amount_cent, to_flow, balance_cent, date, ...cashFlow }: DbCashFlow): CashFlow => {
  return {
    amount: centsToStr(amount_cent),
    direction: to_flow ? FlowDirection.To : FlowDirection.From,
    balance: centsToStr(balance_cent),
    date: sanitizeDate(date),
    ...cashFlow,
  };
};

export class CashFlowRepository extends AbstractRepository {
  async getAll(workbookId: string) {
    const { rows } = await this.qm().query<DbCashFlow>({
      text: `
with
  flows as (select * from cash_flows where workbook_id = $1),
  trans as (select * from transactions where workbook_id = $1),
  flows_balance as (
SELECT flows.workbook_id,
  flows.transaction_id,
  flows.account_id,
  flows.other_account_id,
  flows.to_flow,
  flows.amount_cent,
  trans.date,
  trans.type,
  trans.description,
  trans.detail,
  trans."order",
  sum(flows.amount_cent) OVER (PARTITION BY flows.account_id ORDER BY trans.pending, trans.date, trans."order") AS balance_cent,
  trans.pending
FROM flows JOIN trans ON flows.transaction_id = trans.id)
select * from flows_balance`,
      values: [workbookId],
    });
    return rows.map(convertCashFlow);
  }

  async findAfterDate(workbook_id: string, accountIds: string[], date: string) {
    const { rows } = await this.qm().query<DbCashFlow>({
      text: `
with
  flows as (select * from cash_flows where workbook_id = $1 and account_id = ANY($2::uuid[])),
  trans as (select * from transactions where workbook_id = $1),
  flows_balance as (
SELECT flows.workbook_id,
  flows.transaction_id,
  flows.account_id,
  flows.other_account_id,
  flows.to_flow,
  flows.amount_cent,
  trans.date,
  trans.type,
  trans.description,
  trans.detail,
  trans."order",
  sum(flows.amount_cent) OVER (PARTITION BY flows.account_id ORDER BY trans.pending, trans.date, trans."order") AS balance_cent,
  trans.pending
FROM flows JOIN trans ON flows.transaction_id = trans.id)
select * from flows_balance
where date >= $3 or pending = True`,
      values: [workbook_id, accountIds, date],
    });
    return rows.map(convertCashFlow);
  }

  async save(flow: FlatCashFlow) {
    const { workbook_id, transaction_id, account_id, other_account_id, direction, amount } = flow;
    await this.qm().query({
      name: 'cash_flows-save',
      text: `
insert into cash_flows(workbook_id, transaction_id, account_id, other_account_id, to_flow, amount_cent)
values($1, $2, $3, $4, $5, $6)
on conflict (transaction_id, account_id) do update
set other_account_id = excluded.other_account_id,
    to_flow = excluded.to_flow,
    amount_cent = excluded.amount_cent`,
      values: [
        workbook_id,
        transaction_id,
        account_id,
        other_account_id,
        direction === FlowDirection.To,
        strToCents(amount),
      ],
    });
  }

  async remove(flow: FlatCashFlow) {
    const { workbook_id, transaction_id, account_id } = flow;
    await this.qm().query({
      text: 'delete from cash_flows where workbook_id = $1 and transaction_id = $2 and account_id = $3',
      values: [workbook_id, transaction_id, account_id],
    });
  }

  async removeByWorkbook(workbookId: string) {
    await this.qm().query({
      text: 'delete from cash_flows where workbook_id = $1',
      values: [workbookId],
    });
  }
}
