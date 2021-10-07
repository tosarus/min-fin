import { Inject, Injectable } from '@decorators/di';
import { AccountRepository, TransactionRepository, WorkbookRepository } from '../database';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(AccountRepository) private accounts_: AccountRepository,
    @Inject(TransactionRepository) private transactions_: TransactionRepository,
    @Inject(WorkbookRepository) private workbooks_: WorkbookRepository
  ) {}
}
