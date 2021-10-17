import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Transaction } from '../../types';
import { Contract, ContractEditor, fromContract, fromTransaction } from '../Contract';
import { TransactionsTable } from './TransactionsTable';

export const Transactions = () => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<Transaction>>();

  const handleSubmit = (contract: Contract) => {
    setEditable(undefined);
    if (workbook) {
      dispatch(Actions.saveTransaction({ workbookId: workbook.id, trans: fromContract(accounts, contract) }));
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
    setEditable({});
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
      {editable && (
        <ContractEditor open contract={fromTransaction(editable)} onCancel={handleCancel} onSubmit={handleSubmit} />
      )}
      <Box sx={{ overflowY: 'auto' }}>
        <TransactionsTable onRemove={handleRemove} onEdit={handleEdit} />
      </Box>
    </>
  );
};
