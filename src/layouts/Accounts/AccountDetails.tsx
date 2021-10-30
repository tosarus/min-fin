import React from 'react';
import dayjs from 'dayjs';
import { useRoute } from 'wouter';
import { Box, Button, Typography } from '@mui/material';
import { AmountSpan, Title } from '../../common';
import { Account, getAssetAccountTypes } from '../../types';
import { Routes } from '../listViews';

interface AccountDetailsProps {
  account: Account;
  onEdit: (account: Account) => void;
  onRemove: () => void;
}

function formatTitle(name: string, month?: string) {
  if (!month) {
    return name;
  }

  return name + dayjs(month).format('[ in ]MMMM, YYYY');
}

export const AccountDetails = ({ account, onEdit, onRemove }: AccountDetailsProps) => {
  const [, params] = useRoute(Routes.AccountsView);
  const isAsset = getAssetAccountTypes().includes(account.type);

  const handleEdit = () => onEdit(account);
  return (
    <Box sx={{ mb: 2 }}>
      <Title sx={{ textAlign: 'left', display: 'flex' }}>{formatTitle(account.name, params?.month)}</Title>
      {isAsset && (
        <Box sx={{ display: 'flex' }}>
          <Typography sx={{ mr: 2, width: 120 }}>Balance</Typography>
          <AmountSpan amount={account.balance} />
        </Box>
      )}
      <Box sx={{ display: 'flex' }}>
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={onRemove}>Remove</Button>
      </Box>
    </Box>
  );
};
