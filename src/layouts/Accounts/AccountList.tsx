import React from 'react';
// import { useLocation } from 'wouter';
import styled from '@emotion/styled';
import { Box, BoxProps, Divider, Typography } from '@mui/material';
import { AmountSpan, FlexLink, Title } from '../../common';
import { Account } from '../../types';
import { Links } from '../listViews';
import { accountTypeName, editableAccountTypes, sortAccounts } from './utils';

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

const BalanceSpan = styled(AmountSpan)({ marginLeft: 8 });

export const AccountList = ({ sx, accounts }: AccountListProps & BoxProps) => {
  // const [, navigate] = useLocation();
  // const handleAdd = (e: React.MouseEvent, type: AccountType) => {
  //   e.preventDefault();
  //   navigate(Links.accountsNew(type));
  // };

  return (
    <Box sx={{ ...sx, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgb(0, 0, 0, 0.1)', p: 0 }}>
      <Title>Accounts</Title>
      {editableAccountTypes().map((type, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Divider sx={{ mb: 1 }} />}
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}> */}
          <Typography variant="h6">{accountTypeName(type, true)}</Typography>
          {/* <Button size="small" onClick={(e) => handleAdd(e, type)} sx={{ display: 'inline-block' }}>
              add
            </Button>
          </Box> */}
          {sortAccounts(accounts, type).map((acc) => (
            <RoundedLink key={acc.id} href={Links.accountsView(acc.id)}>
              <span>{acc.name}</span>
              <BalanceSpan amount={acc.balance} />
            </RoundedLink>
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
};
