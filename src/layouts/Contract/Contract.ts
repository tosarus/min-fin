import { Account, CashFlow, FlowDirection, Transaction, TransactionType } from '../../types';
import { formatDate, getOpeningAccountId, negateAmount } from '../utils';

export interface Contract {
  id?: string;
  date: string;
  type: TransactionType;
  description: string;
  detail: string;
  amount: string;
  account: string;
  otherAccount: string;
  pending: boolean;
  recurring: boolean;
}

export function fromTransaction(transaction: Partial<Transaction>): Contract {
  const {
    id,
    date,
    type = TransactionType.Expence,
    description = '',
    detail = '',
    amount = '0',
    account_from = '',
    account_to = '',
    pending = false,
    recurring = false,
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
  return {
    id,
    date: formatDate(date),
    type,
    description,
    detail,
    amount,
    account,
    otherAccount,
    pending,
    recurring,
  };
}

export function fromCashFlow(flow: Partial<CashFlow>): Contract {
  const {
    transaction_id: id,
    date,
    type = TransactionType.Expence,
    description = '',
    detail = '',
    direction = FlowDirection.From,
    pending = false,
    recurring = false,
  } = flow;
  let amount = flow.amount ?? '0';
  let account = flow.account_id ?? '';
  let otherAccount = flow.other_account_id ?? '';

  switch (type) {
    case TransactionType.Expence:
      amount = negateAmount(amount);
      break;

    case TransactionType.Income:
      break;

    case TransactionType.Opening:
      otherAccount = '';
      break;

    case TransactionType.Transfer:
      if (direction === FlowDirection.From) {
        amount = negateAmount(amount);
      } else {
        const tmp = account;
        account = otherAccount;
        otherAccount = tmp;
      }
      break;
  }

  return {
    id,
    date: formatDate(date),
    type,
    description,
    detail,
    amount,
    account,
    otherAccount,
    pending,
    recurring,
  };
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
