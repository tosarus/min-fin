import { ColumnDefinitions, MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = {
  created_at: { type: 'timestamp', notNull: true, default: new PgLiteral('current_timestamp') },
  guid: { type: 'uuid', primaryKey: true, default: new PgLiteral('uuid_generate_v1mc()') },
  money_cents: { type: 'integer', notNull: true, default: 0 },
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: { type: 'text', primaryKey: true },
    name: { type: 'text', notNull: true },
    picture: 'text',
    allowed: { type: 'boolean', notNull: true, default: false },
    active_workbook: 'uuid',
  });
  pgm.createTable('workbooks', {
    id: 'guid',
    name: { type: 'text', notNull: true },
    user_id: { type: 'string', notNull: true, references: 'users' },
  });
  pgm.createTable('accounts', {
    id: 'guid',
    workbook_id: { type: 'uuid', notNull: true, references: 'workbooks' },
    name: { type: 'text', notNull: true },
    type: { type: 'text', notNull: true },
    parent_id: 'uuid',
    is_group: { type: 'boolean', notNull: true, default: false },
    balance_cent: 'money_cents',
  });
  pgm.createTable('transactions', {
    id: 'guid',
    workbook_id: { type: 'uuid', notNull: true, references: 'workbooks' },
    date: { type: 'date', notNull: true, default: new PgLiteral('current_date') },
    type: { type: 'text', notNull: true },
    description: { type: 'text', notNull: true },
    detail: 'text',
    order: 'serial',
    amount_cent: 'money_cents',
    account_from_id: { type: 'uuid', notNull: true, references: 'accounts' },
    account_to_id: { type: 'uuid', notNull: true, references: 'accounts' },
  });

  pgm.createIndex('accounts', ['workbook_id']);
  pgm.createIndex('accounts', ['id', 'workbook_id']);
  pgm.createIndex('transactions', ['workbook_id']);
  pgm.createIndex('transactions', ['id', 'workbook_id']);
  pgm.createIndex('transactions', ['workbook_id', 'account_from_id']);
  pgm.createIndex('transactions', ['workbook_id', 'account_to_id']);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('accounts', ['workbook_id']);
  pgm.dropIndex('accounts', ['id', 'workbook_id']);
  pgm.dropIndex('transactions', ['workbook_id']);
  pgm.dropIndex('transactions', ['id', 'workbook_id']);
  pgm.dropIndex('transactions', ['workbook_id', 'account_from_id']);
  pgm.dropIndex('transactions', ['workbook_id', 'account_to_id']);

  pgm.dropTable('transactions', { cascade: true });
  pgm.dropTable('accounts', { cascade: true });
  pgm.dropTable('workbooks', { cascade: true });
  pgm.dropTable('users', { cascade: true });
}
