export interface UserInfo {
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
  active_workbook: string;
}

export interface Workbook {
  id: string;
  name: string;
}

export enum AccountType {
  Income = 'income',
  Expence = 'expence',
  Banking = 'banking',
  Credit = 'credit',
  Opening = 'opening',
  Removed = 'removed',
}

export function userLevelAccounts() {
  return [AccountType.Banking, AccountType.Credit, AccountType.Income, AccountType.Expence];
}

export interface Account {
  id: string;
  workbook_id: string;
  name: string;
  type: AccountType;
  parent_id: string;
  is_group: boolean;
  balance: string;
}

export enum TransactionType {
  Income = 'income',
  Expence = 'expence',
  Transfer = 'transfer',
  Opening = 'opening',
}

export interface Transaction {
  id: string;
  workbook_id: string;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  order: number;
  amount: string;
  account_from: string;
  account_to: string;
}

interface WorldUpdate_ {
  profile: UserInfo;
  accounts: Account[];
  transactions: Transaction[];
  workbooks: Workbook[];
  removedTrans: string[];
}

export type WorldUpdate = Partial<WorldUpdate_>;
