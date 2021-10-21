/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createView(
    'cash_flows_view',
    { replace: true },
    `SELECT
  cf.workbook_id,
  cf.transaction_id,
  cf.account_id,
  cf.other_account_id,
  cf.to_flow,
  cf.amount_cent,
  tr.date,
  tr.type,
  tr.description,
  tr.detail,
  tr.order,
  sum(cf.amount_cent) over (partition by cf.account_id order by tr.date, tr.order) as balance_cent
FROM cash_flows cf JOIN transactions tr
ON cf.transaction_id = tr.id AND (cf.account_id = tr.account_from_id OR cf.account_id = tr.account_to_id)`
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.createView(
    'cash_flows_view',
    { replace: true },
    `SELECT
  cf.workbook_id,
  cf.transaction_id,
  cf.account_id,
  cf.other_account_id,
  cf.to_flow,
  cf.amount_cent,
  tr.date,
  tr.type,
  tr.description,
  tr.detail,
  tr.order
FROM cash_flows cf JOIN transactions tr
ON cf.transaction_id = tr.id AND (cf.account_id = tr.account_from_id OR cf.account_id = tr.account_to_id)`
  );
}
