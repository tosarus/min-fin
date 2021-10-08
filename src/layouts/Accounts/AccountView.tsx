import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { accountTypeName } from './utils';
import { Account } from '../../types';

interface AccountViewProps {
  account: Partial<Account>;
  onEdit: () => void;
  onRemove: () => void;
}
export const AccountView = ({ account, onEdit, onRemove }: AccountViewProps) => {
  return (
    <>
      <Typography variant="h6">{account.name}</Typography>
      <Typography sx={{ my: 2 }}>Type: {accountTypeName(account.type!)}</Typography>
      <Typography sx={{ my: 2 }}>Balance: {account.balance}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onRemove}>Remove</Button>
      </Box>
    </>
  );
};
