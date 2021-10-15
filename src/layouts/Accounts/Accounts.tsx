import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'wouter';
import { Box } from '@mui/material';
import { Selectors } from '../../store';
// import { AccountType } from '../../types';
import { Links, Routes } from '../listViews';
import { AccountList } from './AccountList';
import { AccountPage } from './AccountPage';

export const Accounts = () => {
  const accounts = useSelector(Selectors.currentAccounts);
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', overflowY: 'auto', overflowX: 'hidden' }}>
        <AccountList sx={{ flex: '1 0 25%', minWidth: 300, overflowY: 'auto' }} accounts={accounts ?? []} />
        <Box sx={{ pl: 3, flex: '1 1 75%' }}>
          {/* <Switch>
            <Route path={Routes.AccountsNew}>{(params) => <AccountPage type={params.type as AccountType} />}</Route> */}
          <Route path={Routes.AccountsView}>
            {(params) => {
              const account = accounts?.find((acc) => acc.id === +params.id);
              return account ? <AccountPage account={account} /> : <Redirect to={Links.accounts()} />;
            }}
          </Route>
          {/* </Switch> */}
        </Box>
      </Box>
    </>
  );
};
