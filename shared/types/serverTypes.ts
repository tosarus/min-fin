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

export interface Account {
  id: string;
  workbook_id: string;
  name: string;
  type: AccountType;
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
  detail?: string;
  order: number;
  amount: string;
  account_from: string;
  account_to: string;
  pending: boolean;
  recurring: boolean;
}

export enum FlowDirection {
  From = 'from',
  To = 'to',
}

export interface CashFlow {
  workbook_id: string;
  transaction_id: string;
  account_id: string;
  other_account_id: string;
  direction: FlowDirection;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  order: number;
  amount: string;
  balance: string;
  pending: boolean;
  recurring: boolean;
}

export type CashFlowId = [transaction_id: string, account_id: string];

export interface BudgetAccount {
  id: string;
  workbook_id: string;
  account_id: string;
  amount: string;
  month: string;
}

interface WorldUpdate_ {
  profile: UserInfo;
  accounts: Account[];
  budgets: BudgetAccount[];
  cashFlows: CashFlow[];
  transactions: Transaction[];
  workbooks: Workbook[];
  removedTrans: string[];
  removedFlows: CashFlowId[];
}

export type WorldUpdate = Partial<WorldUpdate_>;

export interface ImportTransaction {
  date: string;
  descr: string;
  detail: string;
  amount: number;
  type: string;
  category: string;
  account: string;
}
