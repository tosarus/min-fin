import { Inject, Injectable } from '@decorators/di';
import { Workbook } from '@shared/types';
import { QueryManager } from '../database';
import { WorkbookRepository } from '../repositories';
import { BaseService } from './di';

@Injectable()
export class WorkbooksService extends BaseService {
  constructor(@Inject(QueryManager) qm: QueryManager) {
    super(qm);
  }

  async getAll(email: string) {
    return await this.resolve(WorkbookRepository).getAll(email);
  }

  async getById(email: string, id: string) {
    return await this.resolve(WorkbookRepository).getById(email, id);
  }

  async getActive(email: string) {
    return await this.resolve(WorkbookRepository).findActive(email);
  }

  async save(email: string, workbook: Workbook) {
    if (!workbook) {
      throw 'Save workbook: should have a body';
    }

    if (!workbook.name) {
      throw 'Save workbook: should have a name';
    }

    if (workbook.id) {
      return await this.resolve(WorkbookRepository).update(email, workbook);
    } else {
      return await this.resolve(WorkbookRepository).create(email, workbook);
    }
  }

  async remove(email: string, id: string) {
    return await this.resolve(WorkbookRepository).remove(email, id);
  }
}
