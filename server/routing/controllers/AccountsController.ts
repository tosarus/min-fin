import { Response } from 'express';
import { Inject } from '@decorators/di';
import { Body, Controller, Delete, Get, Params, Post, Put, Response as Res } from '@decorators/express';
import { CheckToken, ValidateWorkbook } from '../middleware';
import { Account, AccountRepository } from '../../database';

@Controller('/accounts', [CheckToken])
export class AccountsController {
  constructor(@Inject(AccountRepository) private repository_: AccountRepository) {}

  @Get('/:workbookId(\\d+)', [ValidateWorkbook])
  async getAccounts(@Res() res: Response, @Params('workbookId') workbookId: string) {
    res.json(await this.repository_.getForWorkbook(+workbookId));
  }

  @Post('/:workbookId(\\d+)', [ValidateWorkbook])
  async createAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() account: Account) {
    if (!account || !account.name || !account.type) {
      throw 'New account: should provide name and type';
    }
    res.json(await this.repository_.create(+workbookId, account));
  }

  @Put('/:workbookId(\\d+)', [ValidateWorkbook])
  async updateAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() account: Account) {
    if (!account || !account.id) {
      throw 'Upate account: should provide id';
    }
    res.json(await this.repository_.update(+workbookId, account));
  }

  @Delete('/:workbookId(\\d+)/:id(\\d+)', [ValidateWorkbook])
  async deleteAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Params('id') accountId: string) {
    res.json(await this.repository_.remove(+workbookId, +accountId));
  }
}
