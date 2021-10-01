import { Pool } from 'pg';
import { Configuration } from '../config';

let _admins: string[] = [];
let _db: Pool;

interface DbInfo {
  now: string;
  db: string;
}

export function createDb(config: Configuration): Promise<string> {
  _admins = config.admins;
  _db = new Pool({
    connectionString: config.pg.database,
    ssl: config.pg.ssl ? { rejectUnauthorized: false } : undefined,
  });
  return _db
    .query<DbInfo>('select now() as now, current_database() as db')
    .then(({ rows }) => `${rows[0].db} at ${rows[0].now}`);
}

export default function db() {
  return _db;
}

export function isAdmin(email: string) {
  return _admins.includes(email);
}
