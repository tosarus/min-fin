import React from 'react';
import currency from 'currency.js';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType, Transaction, dateOrderCompare, TransactionType } from '../../types';

interface TransactionsTableProps {
  accountId?: string;
  onRemove: (id: string) => void;
  onEdit?: (tr: Partial<Transaction>) => void;
}

export const TransactionsTable = ({ accountId, onRemove, onEdit = () => {} }: TransactionsTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const transactions = useSelector(Selectors.currentTransactions) ?? [];

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          {accountId ? (
            <TableCell>Source</TableCell>
          ) : (
            <>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
            </>
          )}
          <TableCell>Description</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortTransactions(transactions, accountId).map((tr) => (
          <TableRow key={tr.id}>
            <TableCell>{dateFormat(tr.date, 'isoDate')}</TableCell>
            {accountId ? (
              <TableCell>{buildCategory(tr, accountMap, accountId)}</TableCell>
            ) : (
              <>
                <TableCell>{buildFrom(tr, accountMap)}</TableCell>
                <TableCell>{buildTo(tr, accountMap)}</TableCell>
              </>
            )}
            <TableCell>{tr.description}</TableCell>
            <TableCell>
              <AmountSpan amount={buildAmount(tr, accountId)} />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', flexFlow: 'column' }}>
                <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onRemove(tr.id)}>
                  remove
                </Button>
                <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onEdit(tr)}>
                  edit
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function sortTransactions(transactions: Transaction[], accId?: string) {
  return [...transactions]
    .filter((tr) => {
      if (!accId) {
        return true;
      }
      return tr.account_from === accId || tr.account_to === accId;
    })
    .sort(dateOrderCompare);
}

function buildCategory(tr: Transaction, accMap: Map<string, Account>, accId?: string) {
  switch (tr.type) {
    case TransactionType.Expence:
      return accMap.get(tr.account_to)?.name;
    case TransactionType.Income:
      return accMap.get(tr.account_from)?.name;
    case TransactionType.Transfer:
      if (accId === tr.account_to) {
        return `From '${accMap.get(tr.account_from)?.name}'`;
      } else {
        return `To '${accMap.get(tr.account_to)?.name}'`;
      }
    case TransactionType.Opening:
      return 'Opening';
  }
}

function buildAmount(tr: Transaction, accId?: string) {
  if ((!accId && tr.type === TransactionType.Expence) || (accId && accId === tr.account_from)) {
    return currency(tr.amount).multiply(-1).format();
  }
  return tr.amount;
}

function buildFrom(tr: Transaction, accMap: Map<string, Account>) {
  const acc = accMap.get(tr.account_from);
  if (acc?.type === AccountType.Opening) {
    return '';
  } else {
    return acc?.name;
  }
}

function buildTo(tr: Transaction, accMap: Map<string, Account>) {
  return accMap.get(tr.account_to)?.name;
}
