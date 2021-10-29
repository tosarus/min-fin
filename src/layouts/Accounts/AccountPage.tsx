import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Box } from '@mui/material';
import { Account } from '../../types';
import { CashFlowList } from '../CashFlows';
import { Links } from '../listViews';
import { AccountDetails } from './AccountDetails';
import { AccountEditor } from './AccountEditor';

interface AccountPageProps {
  account: Account;
  onRemove: (account: Account) => void;
  onSubmit: (account: Partial<Account>) => void;
}

export const AccountPage = ({ account, onRemove, onSubmit }: AccountPageProps) => {
  const [editable, setEditable] = useState<Partial<Account>>();
  const [, setLocation] = useLocation();

  const handleEdit = (acc: Account) => {
    setEditable(acc);
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  const handleSubmit = (account: Partial<Account>) => {
    onSubmit(account);
    setEditable(undefined);
  };

  const handleRemove = () => {
    onRemove(account);
    setLocation(Links.accounts());
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', overflowY: 'auto' }}>
      {editable && <AccountEditor open account={editable} onClose={handleClose} onSubmit={handleSubmit} />}
      {account && <AccountDetails account={account} onEdit={handleEdit} onRemove={handleRemove} />}
      {account && <CashFlowList account={account} />}
    </Box>
  );
};
