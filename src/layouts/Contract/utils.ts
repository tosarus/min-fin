import { Account, AccountType, TransactionType } from '../../types';
import { getAssetAccountIds, getAccountIds } from '../Accounts/utils';

export function transactionTypes() {
  return [TransactionType.Expence, TransactionType.Income, TransactionType.Transfer, TransactionType.Opening];
}

export function getAccountIdsByCategory(accounts: Account[], excludeId: string, type: TransactionType) {
  switch (type) {
    case TransactionType.Expence:
      return getAccountIds(accounts, AccountType.Expence);

    case TransactionType.Income:
      return getAccountIds(accounts, AccountType.Income);

    case TransactionType.Transfer:
      return getAssetAccountIds(accounts).filter((id) => id != excludeId);

    case TransactionType.Opening:
      return [];
  }
}
