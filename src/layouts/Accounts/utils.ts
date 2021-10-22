import currency from 'currency.js';
import { Account, AccountType } from '../../types';

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

export function getAssetAccountTypes() {
  return [AccountType.Banking, AccountType.Credit];
}

export function getBudgetAccountTypes() {
  return [AccountType.Income, AccountType.Expence];
}

export function editableAccountTypes() {
  // return [...userLevelAccounts(), AccountType.Opening, AccountType.Removed];
  return [...getAssetAccountTypes(), ...getBudgetAccountTypes()];
}

export function sortAccounts(accounts: Account[], type?: AccountType): Account[] {
  return [...accounts.filter((acc) => !type || acc.type === type)].sort((a, b) => a.name.localeCompare(b.name));
}

export function getAccountIds(accounts: Account[], ...types: AccountType[]) {
  return accounts.filter((acc) => types.includes(acc.type)).map((acc) => acc.id);
}

export function getAssetAccountIds(accounts: Account[]) {
  return getAccountIds(accounts, ...getAssetAccountTypes());
}

export function getExenceAccountIds(accounts: Account[]) {
  return getAccountIds(accounts, AccountType.Expence);
}

export function getIncomeAccountIds(accounts: Account[]) {
  return getAccountIds(accounts, AccountType.Income);
}

export function getOpeningAccountId(accounts: Account[]) {
  return getAccountIds(accounts, AccountType.Opening)[0];
}

export function getTotalForAccounts(accounts: Account[], ...types: AccountType[]) {
  return accounts
    .filter((acc) => types.includes(acc.type))
    .reduce((total, acc) => currency(total).add(acc.balance), currency(0))
    .format();
}

export function getFlowAccountFilter(accId: string, isAsset: boolean) {
  return (flow: { account_id: string; other_account_id: string }) =>
    (isAsset ? flow.account_id : flow.other_account_id) === accId;
}
