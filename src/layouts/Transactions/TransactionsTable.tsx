import React, { useMemo } from 'react';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Box, Button, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
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
  const sortedTransactions = useMemo(() => sortTransactions(transactions), [transactions]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const onPageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <StyledTable
      pagination={{
        rowsPerPageOptions: [25, 50, 100],
        count: sortedTransactions.length,
        rowsPerPage,
        page,
        onPageChange,
        onRowsPerPageChange,
      }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ minWidth: 100 }}>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell sx={{ maxWidth: 120, textAlign: 'right' }}>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedTransactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((tr) => (
          <React.Fragment key={tr.id}>
            <TableRow
              sx={{
                '& td:not(:first-child)': { borderBottom: 'none', pb: 0 },
                '&:hover + tr button': { display: 'block' },
              }}>
              <TableCell rowSpan={2}>{dayjs(tr.date).format('MMM D')}</TableCell>
              <TableCell>{tr.description}</TableCell>
              <TableCell>{buildName(tr.account_from, accountMap)}</TableCell>
              <TableCell>{buildName(tr.account_to, accountMap)}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <AmountSpan amount={buildAmount(tr)} />
              </TableCell>
            </TableRow>
            <TableRow sx={{ '& td': { pt: 0 }, '&:hover button': { display: 'block' } }}>
              <TableCell colSpan={2}>
                <Typography variant="body2" color="text.secondary">
                  {tr.detail}
                </Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'flex-start' }}>
                  <Button sx={{ display: 'none', m: 0, p: 0, ml: 'auto' }} size="small" onClick={() => onEdit(tr)}>
                    edit
                  </Button>
                  <Button sx={{ display: 'none', m: 0, p: 0 }} size="small" onClick={() => onRemove(tr.id)}>
                    remove
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </StyledTable>
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

function buildName(accId: string, accMap: Map<string, Account>) {
  const acc = accMap.get(accId);
  return getDisplayName(acc);
}
