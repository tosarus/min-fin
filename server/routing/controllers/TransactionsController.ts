import { Service } from 'typedi';
import { Body, Controller, Delete, Get, Param, Post, UploadedFile } from '@shared/routing-controllers';
import { Transaction } from '@shared/types';
import { ImportService, TransactionsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/transactions/:workbookId', [CheckToken, ValidateWorkbook])
@Service()
export class TransactionsController {
  constructor(private service_: TransactionsService, private import_: ImportService) {}

  @Get()
  getAll(@Param('workbookId') workbookId: string) {
    return this.service_.getAll(workbookId);
  }

  @Post('/import')
  async import(@Param('workbookId') workbookId: string, @UploadedFile('trans') file: Express.Multer.File) {
    const { transactions } = await this.import_.importTransactions(workbookId, file.originalname, file.buffer.toString());
    const cachFlows = await this.service_.generateCashFlows(workbookId);
    return { ...cachFlows, transactions };
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
