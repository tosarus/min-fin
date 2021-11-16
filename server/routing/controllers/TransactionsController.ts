import { Service } from 'typedi';
import { Transaction, ImportTransaction } from '@shared/types';
import { Body, Controller, Delete, Get, Param, Post, UploadedFile } from '@tosarus/routing-express';
import { StorageService, TransactionsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/transactions/:workbookId', [CheckToken, ValidateWorkbook])
@Service()
export class TransactionsController {
  constructor(private service_: TransactionsService, private store_: StorageService) {}

  @Get()
  getAll(@Param('workbookId') workbookId: string) {
    return this.service_.getAll(workbookId);
  }

  @Get('/export')
  export(@Param('workbookId') workbookId: string) {
    return this.store_.exportTransactions(workbookId);
  }

  @Post('/import')
  async import(@Param('workbookId') workbookId: string, @Body() rawTransactions: ImportTransaction[]) {
    const { transactions } = await this.store_.importTransactions(workbookId, rawTransactions);
    const cachFlows = await this.service_.generateCashFlows(workbookId);
    return { ...cachFlows, transactions };
  }

  @Post('/importCsv')
  async importCsv(@Param('workbookId') workbookId: string, @UploadedFile('trans') file: Express.Multer.File) {
    const rawTransactions = await this.store_.parseTransactions(file.buffer.toString());
    return await this.import(workbookId, rawTransactions);
  }

  @Post()
  save(@Param('workbookId') workbookId: string, @Body() trans: Transaction) {
    return this.service_.processSave(workbookId, trans);
  }

  @Get('/cashflows')
  getCashFlows(@Param('workbookId') workbookId: string) {
    return this.service_.generateCashFlows(workbookId);
  }

  @Delete('/:id')
  remove(@Param('workbookId') workbookId: string, @Param('id') transactionId: string) {
    return this.service_.processRemoval(workbookId, transactionId);
  }
}
