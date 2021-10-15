import { Account, TransactionType } from '../../types';
import { getAssetAccountIds, getExenceAccountIds, getIncomeAccountIds } from '../Accounts/utils';

export function transactionTypes() {
  return [TransactionType.Expence, TransactionType.Income, TransactionType.Transfer, TransactionType.Opening];
}

export function getAccountIdsByCategory(accounts: Account[], excludeId: string, type: TransactionType) {
  switch (type) {
    case TransactionType.Expence:
      return getExenceAccountIds(accounts);

    case TransactionType.Income:
      return getIncomeAccountIds(accounts);

    case TransactionType.Transfer:
      return getAssetAccountIds(accounts).filter((id) => id != excludeId);

    case TransactionType.Opening:
      return [];
  }
}
