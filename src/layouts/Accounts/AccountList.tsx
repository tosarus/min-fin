import React, { useMemo, useState } from 'react';
import { Box, BoxProps, Divider } from '@mui/material';
import { AmountSpan, RoundedLink, Title } from '../../common';
import { Account, AccountType, getAssetAccountTypes, getPublicAccountTypes } from '../../types';
import { Links } from '../listViews';
import { AccountEditor } from './AccountEditor';
import { AccountListGroup } from './AccountListGroup';
import { getTotalForAccounts } from './utils';

interface AccountListProps {
  accounts: Account[];
}

export const AccountList = ({ sx, accounts }: AccountListProps & BoxProps) => {
  const [editable, setEditable] = useState<Partial<Account>>();
  const total = useMemo(() => getTotalForAccounts(accounts, ...getAssetAccountTypes()), [accounts]);

  const handleAdd = (type: AccountType) => {
    setEditable({ type });
  };

  const handleEdit = (account: Account) => {
    setEditable(account);
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  return (
    <Box sx={{ ...sx, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgb(0, 0, 0, 0.1)', p: 0 }}>
      <Title>Accounts</Title>
      {editable && <AccountEditor open account={editable} onClose={handleClose} />}
      <RoundedLink href={Links.accounts()} route="">
        <span>Net Worth</span>
        <AmountSpan amount={total} />
      </RoundedLink>
      {getPublicAccountTypes().map((type, i) => (
        <React.Fragment key={i}>
          <Divider sx={{ mb: 1 }} />
          <AccountListGroup accounts={accounts} type={type} onAdd={handleAdd} onEdit={handleEdit} />
        </React.Fragment>
      ))}
    </Box>
  );
};
