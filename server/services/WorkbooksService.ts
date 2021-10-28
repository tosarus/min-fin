import { Service } from 'typedi';
import { Workbook } from '@shared/types';
import {
  AccountRepository,
  BudgetRepository,
  CashFlowRepository,
  TransactionRepository,
  WorkbookRepository,
} from '../repositories';
import { BaseService } from './BaseService';
import { InTransaction } from './InTransaction';

@Service()
export class WorkbooksService extends BaseService {
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

  @InTransaction()
  async remove(email: string, id: string) {
    await this.resolve(BudgetRepository).removeByWorkbook(id);
    await this.resolve(CashFlowRepository).removeByWorkbook(id);
    await this.resolve(TransactionRepository).removeByWorkbook(id);
    await this.resolve(AccountRepository).removeByWorkbook(id);
    return await this.resolve(WorkbookRepository).remove(email, id);
  }
}
