import React from 'react';
import { useRoute } from 'wouter';
import { Box } from '@mui/material';
import { Title } from '../../common';
import { Account, getAssetAccountTypes } from '../../types';
import { Routes } from '../listViews';
import { formatMonth } from '../utils';
import { AccountAssetDetails } from './AccountAssetDetails';
import { AccountBudgetDetails } from './AccountBudgetDetails';
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

  return (
    <Box sx={{ mb: 2 }}>
      <Title sx={{ display: 'flex', alignItems: 'center' }}>
        <span>{formatTitle(account.name, params?.month)}</span>
        <AccountDetailsButtons account={account} month={params?.month} onEdit={onEdit} />
      </Title>
      {isAsset ? (
        <AccountAssetDetails account={account} />
      ) : (
        <AccountBudgetDetails account={account} month={params?.month} />
      )}
    </Box>
  );
};
