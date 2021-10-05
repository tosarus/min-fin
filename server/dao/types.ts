export interface DbUser {
  id: number;
  email: string;
  name: string;
  picture: string;
  allowed: boolean;
  active_workbook: number;
}

export interface DbWorkbook {
  id: number;
  name: string;
  user_id: number;
}

export enum DbAccountType {
  Income = 'income',
  Expence = 'expence',
  Banking = 'banking',
  Credit = 'credit',
  Opening = 'opening',
}

export interface DbAccount {
  id: number;
  workbook_id: number;
  name: string;
  type: DbAccountType;
  parent_id: number;
  is_group: boolean;
}

export enum DbTransactionType {
  Income = 'income',
  Expence = 'expence',
  Transfer = 'transfer',
  Opening = 'opening',
}

export interface DbTransaction {
  id: number;
  workbook_id: number;
  date: Date;
  description: string;
  detail: string;
  type: DbTransactionType;
  amount_cent: number;
  account_from: number;
  account_to: number;
}

export interface DbBalance {
  id: number;
  workbook_id: number;
  account_id: number;
  amount_cent: number;
}
