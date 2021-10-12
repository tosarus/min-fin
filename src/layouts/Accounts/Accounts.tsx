import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'wouter';
import { Box } from '@mui/material';
import { Selectors } from '../../store';
import { AccountType } from '../../types';
import { Links, Routes } from '../listViews';
import { AccountList } from './AccountList';
import { AccountPage } from './AccountPage';

export const Accounts = () => {
  const accounts = useSelector(Selectors.currentAccounts);
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <AccountList sx={{ flex: '1 0 30%' }} accounts={accounts ?? []} />
        <Box sx={{ px: 3, flex: '1 0 70%' }}>
          <Switch>
            <Route path={Routes.AccountsNew}>
              {(params) => <AccountPage home={Links.accounts()} type={params.type as AccountType} />}
            </Route>
            <Route path={Routes.AccountsView}>
              {(params) => {
                const account = accounts?.find((acc) => acc.id === +params.id);
                return account ? (
                  <AccountPage home={Links.accounts()} account={account} />
                ) : (
                  <Redirect to={Links.accounts()} />
                );
              }}
            </Route>
          </Switch>
        </Box>
      </Box>
    </>
  );
};
