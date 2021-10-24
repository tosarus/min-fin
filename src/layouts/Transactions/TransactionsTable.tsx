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
  showDetails?: boolean;
}

export const TransactionsTable = ({ onRemove, onEdit, showDetails = false }: TransactionsTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const transactions = useSelector(Selectors.currentTransactions) ?? [];

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 140 }}>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell sx={{ textAlign: 'right' }}>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortTransactions(transactions).map((tr) => (
          <React.Fragment key={tr.id}>
            <TableRow>
              <TableCell>{dateFormat(tr.date, 'mediumDate')}</TableCell>
              <TableCell>{tr.description}</TableCell>
              <TableCell>{buildName(tr.account_from, accountMap)}</TableCell>
              <TableCell>{buildName(tr.account_to, accountMap)}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <AmountSpan amount={buildAmount(tr)} />
              </TableCell>
            </TableRow>
            {showDetails && (
              <TableRow>
                <TableCell />
                <TableCell colSpan={4}>
                  <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'flex-start' }}>
                    <Box sx={{ color: 'GrayText' }}>{tr.detail || '<details>'}</Box>
                    <Button sx={{ m: 0, p: 0, ml: 'auto' }} size="small" onClick={() => onEdit(tr)}>
                      edit
                    </Button>
                    <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onRemove(tr.id)}>
                      remove
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
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
