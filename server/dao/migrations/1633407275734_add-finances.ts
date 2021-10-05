/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('accounts', {
    id: 'id',
    workbook_id: { type: 'integer', notNull: true, references: 'workbooks' },
    name: { type: 'text', notNull: true },
    type: { type: 'text', notNull: true },
    parent_id: 'integer',
    is_group: { type: 'boolean', notNull: true, default: false },
    created_at: 'created_at',
  });
  pgm.createTable('transactions', {
    id: 'id',
    workbook_id: { type: 'integer', notNull: true, references: 'workbooks' },
    date: { type: 'date', notNull: true, default: new PgLiteral('current_date') },
    type: { type: 'text', notNull: true },
    description: { type: 'text', notNull: true },
    detail: 'text',
    amount_cent: 'integer',
    account_from_id: { type: 'integer', notNull: true, references: 'accounts' },
    account_to_id: { type: 'integer', notNull: true, references: 'accounts' },
    created_at: 'created_at',
  });
  pgm.createTable('balances', {
    id: 'id',
    workbook_id: { type: 'integer', notNull: true, references: 'workbooks' },
    account_id: { type: 'integer', notNull: true, references: 'accounts' },
    amount_cent: 'integer',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('balances', { cascade: true });
  pgm.dropTable('transactions', { cascade: true });
  pgm.dropTable('accounts', { cascade: true });
}
