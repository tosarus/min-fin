import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'wouter';
import { Box } from '@mui/material';
import { Selectors } from '../../store';
import { Transactions } from '../Transactions';
import { Links, Routes } from '../listViews';
import { AccountBudget } from './AccountBudget';
import { AccountList } from './AccountList';
import { AccountPage } from './AccountPage';
import { getAssetAccountTypes } from './utils';

export const Accounts = () => {
  const accounts = useSelector(Selectors.currentAccounts);
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', overflowY: 'auto', overflowX: 'hidden' }}>
        <AccountList sx={{ flex: '1 0 25%', minWidth: 300, overflowY: 'auto' }} accounts={accounts ?? []} />
        <Box sx={{ pl: 3, flex: '1 1 75%' }}>
          <Switch>
            <Route path={Routes.AccountsView}>
              {(params) => {
                const account = accounts?.find((acc) => acc.id === params.id);
                if (!account) {
                  return <Redirect to={Links.accounts()} />;
                }
                if (getAssetAccountTypes().includes(account.type)) {
                  return <AccountPage account={account} />;
                } else {
                  return <AccountBudget account={account} />;
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
