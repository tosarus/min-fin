import { QueryManager } from '../database';

export abstract class AbstractRepository {
  constructor(private qm_: QueryManager) {}

  qm() {
    return this.qm_;
  }
}
