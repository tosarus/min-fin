import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Box } from '@mui/material';
import { Actions, Selectors } from '../../store';
import { Account, AccountType } from '../../types';
import { TransactionList } from '../Transactions';
import { Links } from '../listViews';
import { AccountDetails } from './AccountDetails';

type AccountPageProps = { account: Account; type?: never } | { account?: never; type: AccountType };

export const AccountPage = ({ account, type }: AccountPageProps) => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  const handleSubmit = (account: Partial<Account>) => {
    if (workbook) {
      dispatch(Actions.saveAccount({ workbookId: workbook.id, account }));
    }
    if (!account.id) {
      setLocation(Links.accounts());
    }
  };
  const handleCancel = () => {
    window.history.back();
  };
  const handleDelete = () => {
    if (workbook && account?.id) {
      dispatch(Actions.removeAccount({ workbookId: workbook.id, id: account.id }));
      setLocation(Links.accounts());
    }
  };

  const acc: Partial<Account> = account ?? { type };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column' }}>
      <AccountDetails account={acc} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={handleCancel} />
      {acc.id && <TransactionList accountId={acc.id} />}
    </Box>
  );
};
