import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('budget_accounts', {
    id: 'guid',
    workbook_id: { type: 'uuid', notNull: true, references: 'workbooks' },
    account_id: { type: 'uuid', notNull: true, references: 'accounts' },
    amount_cent: 'money_cents',
    month: { type: 'date', notNull: true },
  });

  pgm.createIndex('budget_accounts', ['workbook_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('budget_accounts', ['workbook_id']);

  pgm.dropTable('budget_accounts');
}
