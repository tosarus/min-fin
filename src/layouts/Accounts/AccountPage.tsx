import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Box } from '@mui/material';
import { Actions, Selectors } from '../../store';
import { Account, AccountType } from '../../types';
import { AccountDetails } from './AccountDetails';

type AccountPageType = { account: Account; type?: never } | { account?: never; type: AccountType };

type AccountPageProps = { home: string } & AccountPageType;

export const AccountPage = ({ home, account, type }: AccountPageProps) => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  const handleSubmit = (account: Partial<Account>) => {
    if (account.id) {
      dispatch(Actions.updateAccount({ workbookId: workbook!.id, account }));
    } else {
      dispatch(Actions.createAccount({ workbookId: workbook!.id, account }));
      setLocation(home);
    }
  };
  const handleCancel = () => {
    window.history.back();
  };
  const handleDelete = () => {
    if (account?.id) {
      dispatch(Actions.removeAccount({ workbookId: workbook!.id, id: account.id }));
      setLocation(home);
    }
  };

  const acc: Partial<Account> = account ?? { type };

  return (
    <Box>
      <AccountDetails account={acc} onSubmit={handleSubmit} onDelete={handleDelete} onCancel={handleCancel} />
    </Box>
  );
};
