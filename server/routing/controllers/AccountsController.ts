import { Response } from 'express';
import { Body, Controller, Delete, Get, Params, Post, Put, Response as Res } from '@decorators/express';
import { Account } from '@shared/types';
import { CheckToken, ValidateWorkbook } from '../middleware';
import { AccountDao } from '../../database';

@Controller('/accounts/:workbookId(\\d+)', [CheckToken, ValidateWorkbook])
export class AccountsController {
  @Get('')
  async getAccounts(@Res() res: Response, @Params('workbookId') workbookId: string) {
    res.json(await AccountDao.getAll(+workbookId));
  }

  @Post('')
  async createAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() account: Account) {
    if (!account || !account.name || !account.type) {
      throw 'New account: should provide name and type';
    }
    res.json(await AccountDao.create(+workbookId, account));
  }

  @Put('')
  async updateAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() account: Account) {
    if (!account || !account.id) {
      throw 'Upate account: should provide id';
    }
    res.json(await AccountDao.update(+workbookId, account));
  }

  @Delete('/:id(\\d+)')
  async deleteAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Params('id') accountId: string) {
    res.json(await AccountDao.remove(+workbookId, +accountId));
  }
}
