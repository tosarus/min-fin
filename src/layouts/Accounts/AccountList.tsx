import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Box, BoxProps, Button, Divider, Typography } from '@mui/material';
import { AmountSpan, FlexLink, Title } from '../../common';
import { Account, AccountType } from '../../types';
import { Links } from '../listViews';
import { AccountEditor } from './AccountEditor';
import { accountTypeName, editableAccountTypes, getAssetAccountTypes, getTotalForAccounts, sortAccounts } from './utils';

interface AccountListProps {
  accounts: Account[];
}

const RoundedLink = styled(FlexLink)({
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  paddingLeft: 8,
  paddingRight: 8,
  marginLeft: 8,
  marginRight: 8,
  marginBottom: 8,
  borderRadius: 16,
});

export const AccountList = ({ sx, accounts }: AccountListProps & BoxProps) => {
  const [editorType, setEditorType] = useState<AccountType>();
  const total = useMemo(() => getTotalForAccounts(accounts, ...getAssetAccountTypes()), [accounts]);

  const handleAdd = (e: React.MouseEvent, type: AccountType) => {
    e.preventDefault();
    setEditorType(type);
  };

  const handleClose = () => {
    setEditorType(undefined);
  };

  return (
    <Box sx={{ ...sx, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgb(0, 0, 0, 0.1)', p: 0 }}>
      <Title>Accounts</Title>
      {editorType && <AccountEditor open account={{ type: editorType }} onClose={handleClose} />}
      <RoundedLink href={Links.accounts()} route="">
        <span>Net Worth</span>
        <AmountSpan amount={total} />
      </RoundedLink>
      {editableAccountTypes().map((type, i) => (
        <React.Fragment key={i}>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">{accountTypeName(type, true)}</Typography>
            <Button size="small" onClick={(e) => handleAdd(e, type)} sx={{ display: 'inline-block' }}>
              add
            </Button>
          </Box>
          {sortAccounts(accounts, type).map((acc) => (
            <RoundedLink key={acc.id} href={Links.accountsView(acc.id)}>
              <span>{acc.name}</span>
              {getAssetAccountTypes().includes(acc.type) ? <AmountSpan amount={acc.balance} /> : <></>}
            </RoundedLink>
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
};
