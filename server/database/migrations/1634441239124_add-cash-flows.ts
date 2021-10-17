/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('cash_flows', {
    workbook_id: { type: 'uuid', notNull: true, references: 'workbooks' },
    transaction_id: { type: 'uuid', primaryKey: true, references: 'transactions' },
    account_id: { type: 'uuid', primaryKey: true, references: 'accounts' },
    other_account_id: { type: 'uuid', notNull: true, references: 'accounts' },
    to_flow: { type: 'boolean', notNull: true, default: false },
    amount_cent: 'money_cents',
  });

  pgm.createIndex('cash_flows', ['workbook_id']);
  pgm.createIndex('cash_flows', ['workbook_id', 'transaction_id', 'account_id']);

  pgm.createView(
    'cash_flows_view',
    {},
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

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropView('cash_flows_view');

  pgm.dropIndex('cash_flows', ['workbook_id']);
  pgm.dropIndex('cash_flows', ['workbook_id', 'transaction_id', 'account_id']);

  pgm.dropTable('cash_flows');
}
