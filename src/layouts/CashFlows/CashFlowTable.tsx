import React from 'react';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Selectors } from '../../store';
import { Account, CashFlow, dateOrderCompare, getAssetAccountTypes } from '../../types';
import { getDisplayName, getFlowAccountFilter } from '../Accounts/utils';

interface CashFlowTableProps {
  account: Account;
  onRemove: (id: string) => void;
  onEdit: (tr: CashFlow) => void;
  showDetails?: boolean;
}

export const CashFlowTable = ({ account, onRemove, onEdit, showDetails = false }: CashFlowTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const isAsset = getAssetAccountTypes().includes(account.type);

  return (
    <StyledTable>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 140 }}>Date</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>{isAsset ? 'Category' : 'Account'}</TableCell>
          <TableCell sx={{ textAlign: 'right' }}>Amount</TableCell>
          <TableCell sx={{ textAlign: 'right' }}>Balance</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortCashFlows(cashFlows, account.id, isAsset).map((flow) => (
          <React.Fragment key={flow.transaction_id}>
            <TableRow>
              <TableCell>{dateFormat(flow.date, 'isoDate')}</TableCell>
              <TableCell>{flow.description}</TableCell>
              <TableCell>{buildCategory(flow, accountMap, isAsset)}</TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <AmountSpan amount={flow.amount} />
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <AmountSpan amount={flow.balance} />
              </TableCell>
            </TableRow>
            {showDetails && (
              <TableRow>
                <TableCell />
                <TableCell colSpan={4}>
                  <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'flex-start' }}>
                    <Box sx={{ color: 'GrayText' }}>{flow.detail || '<details>'}</Box>
                    <Button sx={{ m: 0, p: 0, ml: 'auto' }} size="small" onClick={() => onEdit(flow)}>
                      edit
                    </Button>
                    <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onRemove(flow.transaction_id)}>
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

function sortCashFlows(cashFlows: CashFlow[], id: string, isAsset: boolean) {
  return cashFlows.filter(getFlowAccountFilter(id, isAsset)).sort(dateOrderCompare);
}

function buildCategory(flow: CashFlow, accMap: Map<string, Account>, isAsset: boolean) {
  const acc = accMap.get(isAsset ? flow.other_account_id : flow.account_id);
  return getDisplayName(acc);
}
