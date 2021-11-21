import React, { useState } from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import { AmountSpan, RoundedLink } from '../../common';
import { Account, AccountType, getAssetAccountTypes } from '../../types';
import { Links } from '../listViews';
import { accountTypeName, sortAccounts } from '../utils';

interface AccountListGroupProps {
  accounts: Account[];
  type: AccountType;
  onAdd: (type: AccountType) => void;
}

const RoundedLinkWithHover = styled(RoundedLink)({
  '&:hover button': {
    display: 'block',
  },
});

export const AccountListGroup = ({ accounts, type, onAdd }: AccountListGroupProps) => {
  const isAsset = getAssetAccountTypes().includes(type);
  const [open, setOpen] = useState(isAsset);
  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" onClick={toggleOpen}>
          {accountTypeName(type, true)}
        </Typography>
        <Button size="small" onClick={() => onAdd(type)}>
          add
        </Button>
      </Box>
      {open &&
        sortAccounts(accounts, type).map((acc) => (
          <RoundedLinkWithHover key={acc.id} href={Links.accountsView(acc.id)}>
            <span>{acc.name}</span>
            {isAsset ? <AmountSpan amount={acc.balance} /> : <></>}
          </RoundedLinkWithHover>
        ))}
    </>
  );
};
