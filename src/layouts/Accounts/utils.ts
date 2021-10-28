import currency from 'currency.js';
import { Account, AccountType, getAssetAccountTypes } from '../../types';

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

export function getParentedName(account: Account, accMap?: Map<string, Account>) {
  const parent = accMap?.get(account.parent_id || '');
  return parent ? `${parent.name}: ${account.name}` : account.name;
}

export function sortAccounts(accounts: Account[], type?: AccountType, accMap?: Map<string, Account>): Account[] {
  return accounts
    .filter((acc) => !type || acc.type === type)
    .sort((a, b) => getParentedName(a, accMap).localeCompare(getParentedName(b, accMap)));
}

export function getAccountIds(accounts: Account[], ...types: AccountType[]) {
  return accounts
    .filter((acc) => types.includes(acc.type))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((acc) => acc.id);
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

export function getFlowAccountFilter(type: AccountType, accountIds: string[]) {
  const isAsset = getAssetAccountTypes().includes(type);
  return (flow: { account_id: string; other_account_id: string }) =>
    accountIds.includes(isAsset ? flow.account_id : flow.other_account_id);
}
