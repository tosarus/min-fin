import React, { useMemo } from 'react';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Selectors } from '../../store';
import { Account, CashFlow, dateOrderCompare, getAssetAccountTypes } from '../../types';
import { getDisplayName, getFlowAccountFilter } from '../Accounts/utils';

interface CashFlowTableProps {
  account: Account;
  onRemove: (id: string) => void;
  onEdit: (tr: CashFlow) => void;
}

export const CashFlowTable = ({ account, onRemove, onEdit }: CashFlowTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const sortedCashFlows = useMemo(() => sortCashFlows(cashFlows, account), [account, cashFlows]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const isAsset = getAssetAccountTypes().includes(account.type);

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
        count: sortedCashFlows.length,
        rowsPerPage,
        page,
        onPageChange,
        onRowsPerPageChange,
      }}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ minWidth: 100 }}>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>{isAsset ? 'Category' : 'Account'}</TableCell>
          <TableCell sx={{ maxWidth: 120, textAlign: 'right' }}>Amount</TableCell>
          <TableCell sx={{ maxWidth: 120, textAlign: 'right' }}>Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedCashFlows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((flow) => (
          <React.Fragment key={flow.transaction_id}>
            <TableRow
              sx={{
                '& td:not(:first-child)': { borderBottom: 'none', pb: 0 },
                '&:hover + tr button': { display: 'block' },
              }}>
              <TableCell rowSpan={2}>{dateFormat(flow.date, 'mmm d')}</TableCell>
              <TableCell>{flow.description}</TableCell>
              <TableCell>{buildCategory(flow, accountMap, isAsset)}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <AmountSpan amount={flow.amount} />
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <AmountSpan amount={flow.balance} />
              </TableCell>
            </TableRow>
            <TableRow sx={{ '& td': { pt: 0 }, '&:hover button': { display: 'block' } }}>
              <TableCell colSpan={2}>
                <Typography variant="body2" color="text.secondary">
                  {flow.detail}
                </Typography>
              </TableCell>
              <TableCell colSpan={2} sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'flex-start' }}>
                  <Button sx={{ display: 'none', m: 0, p: 0, ml: 'auto' }} size="small" onClick={() => onEdit(flow)}>
                    edit
                  </Button>
                  <Button sx={{ display: 'none', m: 0, p: 0 }} size="small" onClick={() => onRemove(flow.transaction_id)}>
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

function sortCashFlows(cashFlows: CashFlow[], account: Account) {
  return cashFlows.filter(getFlowAccountFilter(account)).sort(dateOrderCompare);
}

function buildCategory(flow: CashFlow, accMap: Map<string, Account>, isAsset: boolean) {
  const acc = accMap.get(isAsset ? flow.other_account_id : flow.account_id);
  return getDisplayName(acc);
}
