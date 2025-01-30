import { ClientBase, QueryConfig, QueryResultRow } from 'pg';
import { Service } from 'typedi';
import { getPool } from './db';

export type Creator<Class> = new (manager: QueryManager) => Class;

@Service()
export class QueryManager {
  constructor(private client_?: ClientBase) {}

  private client() {
    return this.client_ ?? getPool();
  }

  create<Class>(c: Creator<Class>) {
    return new c(this);
  }

  query<Row extends QueryResultRow>(config: QueryConfig | string) {
    return this.client().query<Row>(config);
  }

  async transaction<Result>(runInTransaction: (manager: QueryManager) => Promise<Result>) {
    if (this.client_) {
      // Already in transaction
      return await runInTransaction(this);
    }

    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      const result = await runInTransaction(new QueryManager(client));
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
