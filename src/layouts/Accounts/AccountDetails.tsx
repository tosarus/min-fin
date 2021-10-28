import React, { useMemo } from 'react';
import currency from 'currency.js';
import { useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { AmountSpan, Title } from '../../common';
import { Selectors } from '../../store';
import { Account, FlowDirection, getAssetAccountTypes, TransactionType } from '../../types';
import { getFlowAccountFilter } from './utils';

interface AccountDetailsProps {
  account: Account;
  onEdit: (account: Account) => void;
  onRemove: () => void;
}

export const AccountDetails = ({ account, onEdit, onRemove }: AccountDetailsProps) => {
  const isAsset = getAssetAccountTypes().includes(account.type);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const total = useMemo(() => {
    const flows = cashFlows.filter(getFlowAccountFilter(account.type, [account.id]));
    return {
      inflow: flows
        .filter(
          (f) =>
            f.type === TransactionType.Income || (f.type === TransactionType.Transfer && f.direction === FlowDirection.To)
        )
        .reduce((t, f) => t.add(f.amount), currency(0))
        .format(),
      outflow: flows
        .filter(
          (f) =>
            f.type === TransactionType.Expence || (f.type === TransactionType.Transfer && f.direction === FlowDirection.From)
        )
        .reduce((t, f) => t.add(f.amount), currency(0))
        .format(),
    };
  }, [cashFlows, account]);

  const handleEdit = () => onEdit(account);
  return (
    <Box sx={{ mb: 2 }}>
      <Title sx={{ textAlign: 'left', display: 'flex' }}>{account.name}</Title>
      {isAsset && (
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ mr: 2, width: 120 }}>Balance</Typography>
          <AmountSpan amount={account.balance} />
        </Box>
      )}
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 2, width: 120 }}>Credits</Typography>
        <AmountSpan amount={total.inflow} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 2, width: 120 }}>Debits</Typography>
        <AmountSpan amount={total.outflow} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={onRemove}>Remove</Button>
      </Box>
    </Box>
  );
};
