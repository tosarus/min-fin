import { ColumnDefinitions, MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = {
  created_at: {
    type: 'timestamp',
    notNull: true,
    default: new PgLiteral('current_timestamp'),
  },
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'text', unique: true, notNull: true },
    name: { type: 'text', notNull: true },
    picture: 'text',
    allowed: { type: 'boolean', notNull: true, default: false },
    active_workbook: 'integer',
    created_at: 'created_at',
  });
  pgm.createTable('workbooks', {
    id: 'id',
    name: { type: 'text', notNull: true },
    user_id: { type: 'integer', notNull: true, references: 'users' },
    created_at: 'created_at',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('workbooks', { cascade: true });
  pgm.dropTable('users', { cascade: true });
}
