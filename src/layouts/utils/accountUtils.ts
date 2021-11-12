import { Account, AccountType, getAssetAccountTypes, getBudgetAccountTypes, TransactionType } from '../../types';

export function accountTypeName(type: AccountType, plural?: boolean): string {
  switch (type) {
    case AccountType.Banking:
      return plural ? 'Bank Accounts' : 'Bank Account';
    case AccountType.Credit:
      return plural ? 'Credit Cards' : 'Credit Card';
    case AccountType.Expence:
      return plural ? 'Expence Categories' : 'Expence Category';
    case AccountType.Income:
      return plural ? 'Income Categories' : 'Income Category';
    case AccountType.Opening:
      return 'Beginning Balace';
    case AccountType.Removed:
      return 'Removed Accounts';
    default:
      return 'Unknown';
  }
}

export function getDisplayName(account?: Account) {
  if (!account) {
    return '';
  }

  switch (account.type) {
    case AccountType.Banking:
    case AccountType.Credit:
      return '[' + account.name + ']';
    case AccountType.Opening:
      return '';
    case AccountType.Removed:
      return '(removed)';
    default:
      return account.name;
  }
}

export function sortAccounts(accounts: Account[], type: AccountType): Account[] {
  return accounts.filter((acc) => acc.type === type).sort((a, b) => a.name.localeCompare(b.name));
}

function getAccountIds(accounts: Account[], type: AccountType) {
  return sortAccounts(accounts, type).map((acc) => acc.id);
}

export function getAssetAccountIds(accounts: Account[]) {
  return Array.prototype.concat(...getAssetAccountTypes().map((type) => getAccountIds(accounts, type)));
}

export function getBudgetAccountIds(accounts: Account[]) {
  return Array.prototype.concat(...getBudgetAccountTypes().map((type) => getAccountIds(accounts, type)));
}

export function getOpeningAccountId(accounts: Account[]) {
  return getAccountIds(accounts, AccountType.Opening)[0];
}

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

export function getFlowAccountFilter(type: AccountType, accountId: string) {
  const isAsset = getAssetAccountTypes().includes(type);
  return isAsset
    ? (flow: { account_id: string; other_account_id: string }) => accountId === flow.account_id
    : (flow: { account_id: string; other_account_id: string }) => accountId === flow.other_account_id;
}
