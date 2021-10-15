import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Transaction } from '../../types';
import { TransactionDialog } from './TransactionDialog';
import { TransactionsTable } from './TransactionsTable';

interface TransactionListProps {
  accountId?: string;
}

export const TransactionList = ({ accountId }: TransactionListProps) => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<Transaction>>();

  const handleSave = (trans: Partial<Transaction>) => {
    setEditable(undefined);
    if (workbook) {
      dispatch(Actions.saveTransaction({ workbookId: workbook.id, trans }));
    }
  };

  const handleRemove = (id: string) => {
    if (workbook) {
      dispatch(Actions.removeTransaction({ workbookId: workbook.id, id }));
    }
  };

  const handleEdit = (tr: Partial<Transaction>) => {
    setEditable(tr);
  };

  const handleAdd = () => {
    setEditable({ account_from: accountId });
  };

  const handleCancel = () => {
    setEditable(undefined);
  };

  return (
    <>
      <Title sx={{ display: 'flex', alignItems: 'baseline' }}>
        <span>Transactions</span>
        <Button onClick={handleAdd}>Add</Button>
      </Title>
      <TransactionDialog open={!!editable} value={editable ?? {}} onCancel={handleCancel} onSave={handleSave} />
      <Box sx={{ overflowY: 'auto' }}>
        <TransactionsTable accountId={accountId} onRemove={handleRemove} onEdit={handleEdit} />
      </Box>
    </>
  );
};
