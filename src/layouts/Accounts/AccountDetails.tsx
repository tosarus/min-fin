import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { AmountSpan, Title } from '../../common';
import { Account, getAssetAccountTypes } from '../../types';

interface AccountDetailsProps {
  account: Account;
  onEdit: (account: Account) => void;
  onRemove: () => void;
}

export const AccountDetails = ({ account, onEdit, onRemove }: AccountDetailsProps) => {
  const isAsset = getAssetAccountTypes().includes(account.type);

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
        <Button onClick={handleEdit}>Edit</Button>
        <Button onClick={onRemove}>Remove</Button>
      </Box>
    </Box>
  );
};
