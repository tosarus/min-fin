import { Inject, Injectable } from '@decorators/di';
import { Workbook } from '@shared/types';
import { WorkbookRepository } from './../database';

@Injectable()
export class WorkbooksService {
  constructor(@Inject(WorkbookRepository) private workbooks_: WorkbookRepository) {}

  async getAll(email: string) {
    return await this.workbooks_.getAll(email);
  }

  async getActive(email: string) {
    return await this.workbooks_.findActive(email);
  }

  async save(email: string, workbook: Workbook) {
    if (!workbook) {
      throw 'Save workbook: should have a body';
    }

    if (!workbook.name) {
      throw 'Save workbook: should have a name';
    }

    if (workbook.id) {
      return await this.workbooks_.update(email, workbook);
    } else {
      return await this.workbooks_.create(email, workbook);
    }
  }

  async remove(email: string, id: string) {
    return await this.workbooks_.remove(email, id);
  }
}
