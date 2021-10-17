import React from 'react';
import currency from 'currency.js';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType, Transaction, dateOrderCompare, TransactionType } from '../../types';

interface TransactionsTableProps {
  onRemove: (id: string) => void;
  onEdit: (tr: Partial<Transaction>) => void;
}

export const TransactionsTable = ({ onRemove, onEdit }: TransactionsTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const transactions = useSelector(Selectors.currentTransactions) ?? [];

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortTransactions(transactions).map((tr) => (
          <TableRow key={tr.id}>
            <TableCell>{dateFormat(tr.date, 'isoDate')}</TableCell>
            <TableCell>{buildFrom(tr, accountMap)}</TableCell>
            <TableCell>{buildTo(tr, accountMap)}</TableCell>
            <TableCell>{tr.description}</TableCell>
            <TableCell>
              <AmountSpan amount={buildAmount(tr)} />
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

function sortTransactions(transactions: Transaction[]) {
  return [...transactions].sort(dateOrderCompare);
}

function buildAmount(tr: Transaction) {
  if (tr.type === TransactionType.Expence) {
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
