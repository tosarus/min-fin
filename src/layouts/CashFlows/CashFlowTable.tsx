import React from 'react';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Selectors } from '../../store';
import { Account, CashFlow, dateOrderCompare } from '../../types';
import { getAssetAccountTypes, getDisplayName, getFlowAccountFilter } from '../Accounts/utils';

interface CashFlowTableProps {
  account: Account;
  onRemove: (id: string) => void;
  onEdit: (tr: CashFlow) => void;
}

export const CashFlowTable = ({ account, onRemove, onEdit }: CashFlowTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const isAsset = getAssetAccountTypes().includes(account.type);

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>{isAsset ? 'Category' : 'Account'}</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Balance</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortCashFlows(cashFlows, account.id, isAsset).map((flow) => (
          <TableRow key={flow.transaction_id}>
            <TableCell>{dateFormat(flow.date, 'isoDate')}</TableCell>
            <TableCell>{buildCategory(flow, accountMap, isAsset)}</TableCell>
            <TableCell>{flow.description}</TableCell>
            <TableCell>
              <AmountSpan amount={flow.amount} />
            </TableCell>
            <TableCell>
              <AmountSpan amount={flow.balance} />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', flexFlow: 'column' }}>
                <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onRemove(flow.transaction_id)}>
                  remove
                </Button>
                <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onEdit(flow)}>
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

function sortCashFlows(cashFlows: CashFlow[], id: string, isAsset: boolean) {
  return cashFlows.filter(getFlowAccountFilter(id, isAsset)).sort(dateOrderCompare);
}

function buildCategory(flow: CashFlow, accMap: Map<string, Account>, isAsset: boolean) {
  const acc = accMap.get(isAsset ? flow.other_account_id : flow.account_id);
  return getDisplayName(acc);
}
