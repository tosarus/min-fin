import { Service } from 'typedi';
import { Account } from '@shared/types';
import { Body, Controller, Delete, Get, Param, Post } from '@tosarus/routing-express';
import { AccountsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/accounts/:workbookId', [CheckToken, ValidateWorkbook])
@Service()
export class AccountsController {
  constructor(private accounts_: AccountsService) {}

  @Get()
  getAccounts(@Param('workbookId') workbookId: string) {
    return this.accounts_.getAll(workbookId);
  }

  @Post()
  saveAccount(@Param('workbookId') workbookId: string, @Body() account: Partial<Account>) {
    return this.accounts_.save(workbookId, account);
  }

  @Delete('/:id')
  deleteAccount(@Param('workbookId') workbookId: string, @Param('id') accountId: string) {
    return this.accounts_.remove(workbookId, accountId);
  }
}
