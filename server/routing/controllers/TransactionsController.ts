import { Service } from 'typedi';
import { Body, Controller, Delete, Get, Param, Post } from '@shared/routing-controllers';
import { Transaction } from '@shared/types';
import { TransactionsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/transactions/:workbookId', [CheckToken, ValidateWorkbook])
@Service()
export class TransactionsController {
  constructor(private service_: TransactionsService) {}

  @Get()
  getAll(@Param('workbookId') workbookId: string) {
    return this.service_.getAll(workbookId);
  }

  @Post()
  saveTransaction(@Param('workbookId') workbookId: string, @Body() trans: Transaction) {
    return this.service_.processSave(workbookId, trans);
  }

  @Delete('/:id')
  deleteAccount(@Param('workbookId') workbookId: string, @Param('id') transactionId: string) {
    return this.service_.processRemoval(workbookId, transactionId);
  }
}
