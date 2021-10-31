import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.dropView('cash_flows_balance');

  pgm.createIndex('cash_flows', ['workbook_id', 'account_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('cash_flows', ['workbook_id', 'account_id']);
  pgm.createView(
    'cash_flows_balance',
    {},
    `
SELECT
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
  SUM(cf.amount_cent) OVER (PARTITION BY cf.account_id ORDER BY tr.date, tr.order) AS balance_cent
FROM cash_flows cf JOIN transactions tr ON cf.transaction_id = tr.id`
  );
}
