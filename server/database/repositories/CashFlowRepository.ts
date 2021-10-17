import { Injectable } from '@decorators/di';
import { centsToStr, strToCents } from '@shared/calcs';
import { CashFlow, FlowDirection, TransactionType } from '@shared/types';
import db from '../db';

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
  // balance_cent: number;
};

const convertCashFlow = ({ amount_cent, to_flow, ...cashFlow }: DbCashFlow): CashFlow => {
  return {
    amount: centsToStr(amount_cent),
    direction: to_flow ? FlowDirection.To : FlowDirection.From,
    balance: centsToStr(0),
    ...cashFlow,
  };
};

@Injectable()
export class CashFlowRepository {
  async getAll(workbookId: string): Promise<CashFlow[]> {
    const { rows } = await db().query<DbCashFlow>({
      text: 'select * from cash_flows_view where workbook_id = $1',
      values: [workbookId],
    });
    return rows.map(convertCashFlow);
  }

  async findAfterDate(workbook_id: string, accountIds: string[], date: string) {
    const { rows } = await db().query<DbCashFlow>({
      text: 'select * from cash_flows_view where workbook_id = $1 and account_id = ANY($2::uuid[]) and date >= $3',
      values: [workbook_id, accountIds, date],
    });
    return rows.map(convertCashFlow);
  }

  async save(flow: CashFlow) {
    const { workbook_id, transaction_id, account_id, other_account_id, direction, amount } = flow;
    await db().query({
      text: `
insert into cash_flows(workbook_id, transaction_id, account_id, other_account_id, to_flow, amount_cent)
values($1, $2, $3, $4, $5, $6)`,
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

  async remove(flow: CashFlow) {
    const { workbook_id, transaction_id, account_id } = flow;
    await db().query({
      text: 'delete from cash_flows where workbook_id = $1 and transaction_id = $2 and account_id = $3',
      values: [workbook_id, transaction_id, account_id],
    });
  }
}
