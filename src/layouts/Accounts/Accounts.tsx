import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'wouter';
import { Box } from '@mui/material';
import { SxProps } from '@mui/system';
import { Actions, Selectors } from '../../store';
import { Account, getPublicAccountTypes } from '../../types';
import { TransactionList } from '../Transactions';
import { Links, Routes } from '../listViews';
import { AccountList } from './AccountList';
import { AccountPage } from './AccountPage';

export const Accounts = () => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();

  const handleSubmit = (account: Partial<Account>) => {
    if (workbook) {
      dispatch(Actions.saveAccount({ workbookId: workbook.id, account }));
    }
  };

  const handleRemove = (account: Account) => {
    if (workbook) {
      dispatch(Actions.removeAccount({ workbookId: workbook.id, id: account.id }));
    }
  };

  const sxLeft: SxProps = { pl: 2, flex: '1 0 22.5%', minWidth: 300, overflowY: 'auto' };
  const sxRight: SxProps = { pl: 2, flex: '1 1 77.5%', display: 'flex', flexFlow: 'column' };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        <AccountList sx={sxLeft} accounts={accounts} onSubmit={handleSubmit} />
        <Box sx={sxRight}>
          <Switch>
            <Route path={Routes.AccountsView}>
              {(params) => {
                const account = accounts.find((acc) => acc.id === params.id);
                if (!account || !getPublicAccountTypes().includes(account.type)) {
                  return <Redirect to={Links.accounts()} />;
                } else {
                  return <AccountPage account={account} onRemove={handleRemove} onSubmit={handleSubmit} />;
                }
              }}
            </Route>
            <Route path={Routes.Accounts}>
              <TransactionList />
            </Route>
          </Switch>
        </Box>
      </Box>
    </>
  );
};
