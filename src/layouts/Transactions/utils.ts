import dateFormat from 'dateformat';
import { Account, AccountType, Transaction, TransactionType } from '../../types';

interface Contract {
  id?: number;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  amount: string;
  account: number;
  otherAccount: number;
}

export function transactionToContract(transaction: Partial<Transaction>): Contract {
  const {
    id,
    date,
    type = TransactionType.Expence,
    description = '',
    detail = '',
    amount = '0',
    account_from = 0,
    account_to = 0,
  } = transaction;
  let account, otherAccount;

  switch (type) {
    case TransactionType.Expence:
    case TransactionType.Transfer:
      account = account_from ?? 0;
      otherAccount = account_to ?? 0;
      break;

    case TransactionType.Income:
      account = account_to ?? 0;
      otherAccount = account_from ?? 0;
      break;

    case TransactionType.Opening:
      account = account_to ?? 0;
      otherAccount = 0;
      break;
  }
  return { id, date: dateFormat(date ?? Date.now(), 'isoDate'), type, description, detail, amount, account, otherAccount };
}

export function contractToTransaction(
  accounts: Account[],
  { account, otherAccount, ...rest }: Contract
): Partial<Transaction> {
  let account_from, account_to;
  switch (rest.type) {
    case TransactionType.Expence:
    case TransactionType.Transfer:
      account_from = account;
      account_to = otherAccount;
      break;

    case TransactionType.Income:
      account_from = otherAccount;
      account_to = account;
      break;

    case TransactionType.Opening:
      account_from = getOpeningAccountId(accounts);
      account_to = account;
      break;
  }
  return { ...rest, account_from, account_to };
}

export function transactionTypes() {
  return [TransactionType.Expence, TransactionType.Income, TransactionType.Transfer, TransactionType.Opening];
}

export function getAccountIdsByCategory(accounts: Account[], excludeId: number, type: TransactionType) {
  switch (type) {
    case TransactionType.Expence:
      return getAccountIds(accounts, AccountType.Expence);

    case TransactionType.Income:
      return getAccountIds(accounts, AccountType.Income);

    case TransactionType.Transfer:
      return getAccountIds(accounts, AccountType.Banking, AccountType.Credit).filter((id) => id != excludeId);

    case TransactionType.Opening:
      return [];
  }
}

export function getAccountIds(accounts: Account[], ...types: AccountType[]) {
  return accounts.filter((acc) => types.includes(acc.type)).map((acc) => acc.id);
}

export function getAssetAccountIds(accounts: Account[]) {
  return getAccountIds(accounts, AccountType.Banking, AccountType.Credit);
}

export function getOpeningAccountId(accounts: Account[]) {
  return getAccountIds(accounts, AccountType.Opening)[0];
}
