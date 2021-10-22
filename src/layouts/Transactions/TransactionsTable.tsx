import React from 'react';
import currency from 'currency.js';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Selectors } from '../../store';
import { Account, Transaction, dateOrderCompare, TransactionType } from '../../types';
import { getDisplayName } from '../Accounts/utils';

interface TransactionsTableProps {
  onRemove: (id: string) => void;
  onEdit: (tr: Partial<Transaction>) => void;
}

export const TransactionsTable = ({ onRemove, onEdit }: TransactionsTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const transactions = useSelector(Selectors.currentTransactions) ?? [];

  return (
    <StyledTable>
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
            <TableCell>{buildName(tr.account_from, accountMap)}</TableCell>
            <TableCell>{buildName(tr.account_to, accountMap)}</TableCell>
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
    </StyledTable>
  );
};

function sortTransactions(transactions: Transaction[]) {
  return transactions.sort(dateOrderCompare);
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
