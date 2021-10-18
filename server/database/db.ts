import runMigrations from 'node-pg-migrate';
import { Pool } from 'pg';
import { Configuration } from '../config';

let _admins: string[] = [];
let _pool: Pool;

interface DbInfo {
  now: string;
  db: string;
}

export async function createDb(config: Configuration): Promise<string> {
  _admins = config.admins;
  const dbConfig = {
    connectionString: config.pg.database,
    ssl: config.pg.ssl ? { rejectUnauthorized: false } : undefined,
  };

  await runMigrations({
    databaseUrl: dbConfig,
    migrationsTable: config.migrations.table,
    dir: config.migrations.folder,
    checkOrder: true,
    direction: 'up',
    count: Infinity,
  });

  _pool = new Pool(dbConfig);
  const { rows } = await _pool.query<DbInfo>('select now() as now, current_database() as db');
  return `${rows[0].db} at ${rows[0].now}`;
}

export function getPool() {
  return _pool;
}

export function isAdmin(email: string) {
  return _admins.includes(email);
}
