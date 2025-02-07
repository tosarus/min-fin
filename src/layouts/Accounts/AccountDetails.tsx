import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRoute } from 'wouter';
import { Box, Typography } from '@mui/material';
import { AmountSpan, Title } from '../../common';
import { Selectors } from '../../store';
import { Account, getAssetAccountTypes } from '../../types';
import { Routes } from '../listViews';
import { calculateExpenses, calculatePending, formatMonth, subtractAmount } from '../utils';
import { AccountDetailsButtons } from './AccountDetailsButtons';

interface AccountDetailsProps {
  account: Account;
  onEdit: (account: Account) => void;
}

function formatTitle(name: string, month?: string) {
  if (!month) {
    return name;
  }

  return `${name} in ${formatMonth(month)}`;
}

export const AccountDetails = ({ account, onEdit }: AccountDetailsProps) => {
  const [, params] = useRoute(Routes.AccountsView);
  const isAsset = getAssetAccountTypes().includes(account.type);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const pendingBalance = useMemo(
    () => (isAsset ? calculatePending(cashFlows, account) : '0'),
    [account, cashFlows, isAsset]
  );
  const totalExpenses = useMemo(
    () => (isAsset ? '0' : calculateExpenses(cashFlows, account, params?.month)),
    [account, cashFlows, isAsset, params]
  );

  return (
    <Box sx={{ mb: 2 }}>
      <Title sx={{ display: 'flex', alignItems: 'center' }}>
        <span>{formatTitle(account.name, params?.month)}</span>
        <AccountDetailsButtons account={account} month={params?.month} onEdit={onEdit} />
      </Title>
      {isAsset ? (
        <>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ mr: 2, width: 120 }}>Balance</Typography>
            <AmountSpan amount={account.balance} />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ mr: 2, width: 120 }}>Posted</Typography>
            <AmountSpan amount={subtractAmount(account.balance, pendingBalance)} />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ mr: 2, width: 120 }}>Pending</Typography>
            <AmountSpan amount={pendingBalance} />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ mr: 2, width: 120 }}>Total</Typography>
          <AmountSpan amount={totalExpenses} />
        </Box>
      )}
    </Box>
  );
};
