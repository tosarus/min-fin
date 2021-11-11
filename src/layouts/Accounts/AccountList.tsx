import React, { useMemo, useState } from 'react';
import { Box, Divider } from '@mui/material';
import { SxProps } from '@mui/system';
import { AmountSpan, RoundedLink, Title } from '../../common';
import { Account, AccountType, getAssetAccountTypes, getPublicAccountTypes } from '../../types';
import { Links } from '../listViews';
import { AccountEditor } from './AccountEditor';
import { AccountListGroup } from './AccountListGroup';
import { getTotalForAccounts } from './utils';

interface AccountListProps {
  accounts: Account[];
  sx?: SxProps;
  onSubmit: (account: Partial<Account>) => void;
}

export const AccountList = ({ sx, accounts, onSubmit }: AccountListProps) => {
  const [editable, setEditable] = useState<Partial<Account>>();
  const total = useMemo(() => getTotalForAccounts(accounts, ...getAssetAccountTypes()), [accounts]);

  const handleAdd = (type: AccountType) => {
    setEditable({ type });
  };

  const handleSubmit = (account: Partial<Account>) => {
    onSubmit(account);
    setEditable(undefined);
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  return (
    <Box sx={{ ...sx, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgb(0, 0, 0, 0.1)' }}>
      <Title>Accounts</Title>
      {editable && <AccountEditor account={editable} onClose={handleClose} onSubmit={handleSubmit} />}
      <RoundedLink href={Links.accounts()} route="">
        <span>Net Worth</span>
        <AmountSpan amount={total} />
      </RoundedLink>
      {getPublicAccountTypes().map((type, i) => (
        <React.Fragment key={i}>
          <Divider sx={{ mb: 1 }} />
          <AccountListGroup accounts={accounts} type={type} onAdd={handleAdd} />
        </React.Fragment>
      ))}
    </Box>
  );
};
