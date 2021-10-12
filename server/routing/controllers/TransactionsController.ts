import { Response } from 'express';
import { Inject } from '@decorators/di';
import { Body, Controller, Delete, Get, Params, Post, Put, Response as Res } from '@decorators/express';
import { Transaction } from '@shared/types';
import { TransactionsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/transactions', [CheckToken])
export class TransactionsController {
  constructor(@Inject(TransactionsService) private service_: TransactionsService) {}

  @Get('/:workbookId(\\d+)', [ValidateWorkbook])
  async getAll(@Res() res: Response, @Params('workbookId') workbookId: string) {
    res.json(await this.service_.getAll(+workbookId));
  }

  @Post('/:workbookId(\\d+)', [ValidateWorkbook])
  async createTransaction(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() trans: Transaction) {
    res.json(await this.service_.processNew(+workbookId, trans));
  }

  @Put('/:workbookId(\\d+)', [ValidateWorkbook])
  async updateAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() trans: Transaction) {
    res.json(await this.service_.processUpdate(+workbookId, trans));
  }

  @Delete('/:workbookId(\\d+)/:id(\\d+)', [ValidateWorkbook])
  async deleteAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Params('id') transactionId: string) {
    res.json(await this.service_.processRemoval(+workbookId, +transactionId));
  }
}
