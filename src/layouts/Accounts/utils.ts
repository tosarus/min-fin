import { Account, AccountType, userLevelAccounts } from '../../types';

export function accountTypeName(type: AccountType, plural?: boolean): string {
  switch (type) {
    case AccountType.Banking:
      return plural ? 'Bank Accounts' : 'Bank Account';
    case AccountType.Credit:
      return plural ? 'Credit Cards' : 'Credit Card';
    case AccountType.Expence:
      return plural ? 'Expence Categories' : 'Expence';
    case AccountType.Income:
      return plural ? 'Income Categories' : 'Income';
    case AccountType.Opening:
      return 'Beginning Balace';
    case AccountType.Removed:
      return 'Removed Accounts';
    default:
      return 'Unknown';
  }
}

export function editableAccountTypes() {
  return [...userLevelAccounts(), AccountType.Opening, AccountType.Removed];
}

export function sortAccounts(accounts: Account[], type?: AccountType): Account[] {
  return [...accounts.filter((acc) => !type || acc.type === type)].sort((a, b) => a.name.localeCompare(b.name));
}
