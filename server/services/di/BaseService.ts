import { Creator, QueryManager } from '../../database';

export abstract class BaseService {
  constructor(private qm_: QueryManager) {}

  getManager() {
    return this.qm_;
  }

  setManager(qm: QueryManager) {
    this.qm_ = qm;
  }

  resolve<Class>(c: Creator<Class>): Class {
    return this.getManager().create(c);
  }
}
