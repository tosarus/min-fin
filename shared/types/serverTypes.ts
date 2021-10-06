export interface UserInfo {
  email: string;
  name: string;
  picture: string;
  is_admin: boolean;
  allowed: boolean;
  active_workbook: number;
}

export interface Workbook {
  id: number;
  name: string;
}

export enum AccountType {
  Income = 'income',
  Expence = 'expence',
  Banking = 'banking',
  Credit = 'credit',
  Opening = 'opening',
}

export interface Account {
  id: number;
  workbook_id: number;
  name: string;
  type: AccountType;
  parent_id: number;
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
  id: number;
  workbook_id: number;
  date: Date;
  type: TransactionType;
  description: string;
  detail: string;
  amount: string;
  account_from: number;
  account_to: number;
}
