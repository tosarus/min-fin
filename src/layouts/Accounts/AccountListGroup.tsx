import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';
import { AmountSpan, RoundedLink } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType, getAssetAccountTypes } from '../../types';
import { Links } from '../listViews';
import { accountTypeName, getParentedName, sortAccounts } from './utils';

interface AccountListGroupProps {
  accounts: Account[];
  type: AccountType;
  onAdd: (type: AccountType) => void;
  onEdit: (account: Account) => void;
}

const RoundedLinkWithHover = styled(RoundedLink)({
  '&:hover button': {
    display: 'block',
  },
});

export const AccountListGroup = ({ accounts, type, onAdd, onEdit }: AccountListGroupProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
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
        sortAccounts(accounts, type, accountMap).map((acc) => (
          <RoundedLinkWithHover key={acc.id} href={Links.accountsView(acc.id)}>
            <span>{getParentedName(acc, accountMap)}</span>
            {isAsset ? (
              <AmountSpan amount={acc.balance} />
            ) : (
              <Button onClick={() => onEdit(acc)} sx={{ p: 0, m: 0, display: 'none' }}>
                edit
              </Button>
            )}
          </RoundedLinkWithHover>
        ))}
    </>
  );
};
