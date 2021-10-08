import React from 'react';
import { Button, Divider, List, ListItem, ListItemText, ListProps, Typography } from '@mui/material';
import { accountTypeName, editableAccountTypes, sortAccounts } from './utils';
import { Account, AccountType } from '../../types';

interface AccountListProps {
  accounts: Account[];
  selectedId?: number;
  onAccountSelect: (account: Account) => void;
  onAccountAdd: (type: AccountType) => void;
}

export const AccountList = ({ sx, accounts, selectedId, onAccountAdd, onAccountSelect }: AccountListProps & ListProps) => {
  const handleAdd = (e: React.MouseEvent, type: AccountType) => {
    e.preventDefault();
    onAccountAdd(type);
  };

  const handleSelect = (e: React.MouseEvent, acc: Account) => {
    e.preventDefault();
    onAccountSelect(acc);
  };

  return (
    <List sx={{ ...sx, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgb(0, 0, 0, 0.1)' }}>
      {editableAccountTypes().map((type, i) => (
        <>
          {i > 0 && <Divider />}
          <ListItem sx={{ display: 'flex', pl: 1, pr: 0 }}>
            <Typography variant="h6">{accountTypeName(type, true)}</Typography>
            <Button size="small" onClick={(e) => handleAdd(e, type)} sx={{ display: 'inline-block', ml: 'auto' }}>
              add
            </Button>
          </ListItem>
          {sortAccounts(accounts, type).map((acc) => (
            <ListItemText
              sx={{
                px: 2,
                py: 0.25,
                m: 1,
                background: selectedId === acc.id ? 'rgb(0, 0, 0, 0.08)' : undefined,
                borderRadius: 4,
              }}
              onClick={(e) => handleSelect(e, acc)}
              key={acc.id}>
              {acc.name} ({acc.balance})
            </ListItemText>
          ))}
        </>
      ))}
    </List>
  );
};
