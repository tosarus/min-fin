import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import { Box } from '@mui/material';
import { Actions, Selectors } from '../../store';
import { Account } from '../../types';
import { CashFlowList } from '../CashFlows';
import { Links } from '../listViews';
import { AccountDetails } from './AccountDetails';
import { AccountEditor } from './AccountEditor';

interface AccountPageProps {
  account: Account;
}

export const AccountPage = ({ account }: AccountPageProps) => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const [editable, setEditable] = useState<Partial<Account>>();
  const [, setLocation] = useLocation();
  const dispatch = useDispatch();

  const handleEdit = (acc: Account) => {
    setEditable(acc);
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  const handleRemove = () => {
    if (workbook) {
      dispatch(Actions.removeAccount({ workbookId: workbook.id, id: account.id }));
      setLocation(Links.accounts());
    }
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', overflowY: 'auto' }}>
      {editable && <AccountEditor open account={editable} onClose={handleClose} />}
      {account && <AccountDetails account={account} onEdit={handleEdit} onRemove={handleRemove} />}
      {account && <CashFlowList account={account} />}
    </Box>
  );
};
