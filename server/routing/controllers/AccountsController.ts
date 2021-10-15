import { Response } from 'express';
import { Inject } from '@decorators/di';
import { Body, Controller, Delete, Get, Params, Post, Response as Res } from '@decorators/express';
import { Account } from '@shared/types';
import { AccountsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/accounts', [CheckToken])
export class AccountsController {
  constructor(@Inject(AccountsService) private accounts_: AccountsService) {}

  @Get('/:workbookId(\\d+)', [ValidateWorkbook])
  async getAccounts(@Res() res: Response, @Params('workbookId') workbookId: string) {
    res.json(await this.accounts_.getAll(+workbookId));
  }

  @Post('/:workbookId(\\d+)', [ValidateWorkbook])
  async saveAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Body() account: Partial<Account>) {
    res.json(await this.accounts_.save(+workbookId, account));
  }

  @Delete('/:workbookId(\\d+)/:id(\\d+)', [ValidateWorkbook])
  async deleteAccount(@Res() res: Response, @Params('workbookId') workbookId: string, @Params('id') accountId: string) {
    res.json(await this.accounts_.remove(+workbookId, +accountId));
  }
}
