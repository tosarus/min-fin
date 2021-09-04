import { Pool } from 'pg';
import { Configuration } from '../config';

let _db: Pool;

export function createDb(config: Configuration): Promise<Pool> {
  _db = new Pool({
    connectionString: config.pg.database,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return _db.query('select now()').then(() => _db);
}

export default function db() {
  return _db;
}
