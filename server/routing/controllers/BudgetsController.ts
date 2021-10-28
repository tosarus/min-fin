import { Service } from 'typedi';
import { Body, Controller, Delete, Get, Param, Post } from '@shared/routing-controllers';
import { BudgetAccount } from '@shared/types';
import { BudgetsService } from '../../services';
import { CheckToken, ValidateWorkbook } from '../middleware';

@Controller('/budgets/:workbookId', [CheckToken, ValidateWorkbook])
@Service()
export class BudgetsController {
  constructor(private budgets_: BudgetsService) {}

  @Get()
  getAllBudgets(@Param('workbookId') workbookId: string) {
    return this.budgets_.getAll(workbookId);
  }

  @Post()
  saveBudget(@Param('workbookId') workbookId: string, @Body() budget: Partial<BudgetAccount>) {
    return this.budgets_.save(workbookId, budget);
  }

  @Delete('/:id')
  removeBudget(@Param('workbookId') workbookId: string, @Param('id') budgetId: string) {
    return this.budgets_.remove(workbookId, budgetId);
  }
}
