import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'wouter';
import { Box } from '@mui/material';
import { Selectors } from '../../store';
import { getPublicAccountTypes } from '../../types';
import { Transactions } from '../Transactions';
import { Links, Routes } from '../listViews';
import { AccountList } from './AccountList';
import { AccountPage } from './AccountPage';

export const Accounts = () => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <AccountList sx={{ flex: '1 0 22.5%', minWidth: 300, overflowY: 'auto' }} accounts={accounts} />
        <Box sx={{ pl: 3, flex: '1 1 77.5%', display: 'flex', flexFlow: 'column' }}>
          <Switch>
            <Route path={Routes.AccountsView}>
              {(params) => {
                const account = accounts.find((acc) => acc.id === params.id);
                if (!account || !getPublicAccountTypes().includes(account.type)) {
                  return <Redirect to={Links.accounts()} />;
                } else {
                  return <AccountPage account={account} />;
                }
              }}
            </Route>
            <Route path={Routes.Accounts}>
              <Transactions />
            </Route>
          </Switch>
        </Box>
      </Box>
    </>
  );
};
