import { useMemo } from 'react';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { makeStyledTable, renderDetails, StyledColumn } from '../../common';
import { Selectors } from '../../store';
import { Account, Transaction, dateOrderCompare, TransactionType } from '../../types';
import { getDisplayName } from '../Accounts/utils';

interface TransactionsTableProps {
  onRemove: (tr: Transaction) => void;
  onEdit: (tr: Transaction) => void;
}

export const TransactionsTable = ({ onRemove, onEdit }: TransactionsTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const transactions = useSelector(Selectors.currentTransactions) ?? [];
  const sortedTransactions = useMemo(() => sortTransactions(transactions), [transactions]);

  const headers = [] as StyledColumn<Transaction>[];
  headers.push({ name: 'Date', value: (tr) => dayjs(tr.date).format('MMM D'), type: 'date' });
  headers.push({ name: 'Description', value: (tr) => tr.description });
  headers.push({ name: 'From', value: (tr) => buildName(tr.account_from, accountMap) });
  headers.push({ name: 'To', value: (tr) => buildName(tr.account_to, accountMap) });
  headers.push({ name: 'Amount', value: (tr) => buildAmount(tr), type: 'amount' });

  return makeStyledTable({
    items: sortedTransactions,
    headers,
    detail: (tr) => renderDetails(tr.detail || ''),
    onEdit,
    onRemove,
  });
};

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(dateOrderCompare);
}

function buildAmount(tr: Transaction) {
  if (tr.type === TransactionType.Expence) {
    return currency(tr.amount).multiply(-1).format();
  }
  return tr.amount;
}

function buildName(accId: string, accMap: Map<string, Account>) {
  const acc = accMap.get(accId);
  return getDisplayName(acc);
}
