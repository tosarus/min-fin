import dateFormat from 'dateformat';
import { Account, Transaction, TransactionType } from '../../types';
import { getOpeningAccountId } from '../Accounts/utils';

export interface Contract {
  id?: string;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  amount: string;
  account: string;
  otherAccount: string;
}

export function toContract(transaction: Partial<Transaction>): Contract {
  const {
    id,
    date,
    type = TransactionType.Expence,
    description = '',
    detail = '',
    amount = '0',
    account_from = '',
    account_to = '',
  } = transaction;
  let account: string;
  let otherAccount: string;

  switch (type) {
    case TransactionType.Expence:
    case TransactionType.Transfer:
      account = account_from ?? '';
      otherAccount = account_to ?? '';
      break;

    case TransactionType.Income:
      account = account_to ?? '';
      otherAccount = account_from ?? '';
      break;

    case TransactionType.Opening:
      account = account_to ?? '';
      otherAccount = '';
      break;
  }
  return { id, date: dateFormat(date ?? Date.now(), 'isoDate'), type, description, detail, amount, account, otherAccount };
}

export function fromContract(accounts: Account[], { account, otherAccount, ...contract }: Contract): Partial<Transaction> {
  let account_from: string;
  let account_to: string;

  switch (contract.type) {
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
  return { ...contract, account_from, account_to };
}
