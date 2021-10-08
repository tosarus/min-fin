import { Account, AccountType } from '../../types';

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
    default:
      return 'Unknown';
  }
}

export function editableAccountTypes() {
  return [AccountType.Banking, AccountType.Credit, AccountType.Income, AccountType.Expence];
}

export function sortAccounts(accounts: Account[], type?: AccountType): Account[] {
  return [...accounts.filter((acc) => !type || acc.type === type)].sort((a, b) => a.name.localeCompare(b.name));
}
