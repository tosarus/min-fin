import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, LinearProgress } from '@mui/material';
import { AccountList } from './AccountList';
import { AccountHeader } from './AccountHeader';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Account, AccountType } from '../../types';

export const Accounts = () => {
  const activeWorkbook = useSelector(Selectors.activeWorkbook);
  const accounts = useSelector(Selectors.accounts);
  const dispath = useDispatch();
  const [selection, setSelection] = useState<Partial<Account>>();

  useEffect(() => {
    if (!activeWorkbook) {
      dispath(Actions.getActiveWorkbook());
    } else if (!accounts) {
      dispath(Actions.listAccounts(activeWorkbook.id));
    }
  }, [activeWorkbook, accounts, dispath]);

  const handleSelect = (acc: Account) => {
    setSelection(acc);
  };

  const handleAdd = (type: AccountType) => {
    setSelection({ type });
  };

  const handleSubmit = (account: Partial<Account>) => {
    setSelection(undefined);
    if (account.id) {
      dispath(Actions.updateAccount({ workbookId: activeWorkbook!.id, account }));
    } else {
      dispath(Actions.createAccount({ workbookId: activeWorkbook!.id, account }));
    }
  };

  const handleCancel = () => {
    setSelection(undefined);
  };

  const handleRemove = (id: number) => {
    dispath(Actions.removeAccount({ id, workbookId: activeWorkbook!.id }));
  };

  return (
    <>
      <Title>Accounts</Title>
      {accounts ? (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <AccountList
            selectedId={selection?.id}
            sx={{ flex: '1 0 30%' }}
            accounts={accounts}
            onAccountSelect={handleSelect}
            onAccountAdd={handleAdd}
          />
          <Box sx={{ px: 3, py: 2, flex: '1 0 70%' }}>
            {selection && (
              <AccountHeader account={selection!} onSubmit={handleSubmit} onCancel={handleCancel} onRemove={handleRemove} />
            )}
          </Box>
        </Box>
      ) : (
        <LinearProgress />
      )}
    </>
  );
};
