import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Transaction } from '../../types';
import { ContractEditor, fromTransaction } from '../Contract';
import { TransactionsTable } from './TransactionsTable';

export const Transactions = () => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<Transaction>>();

  const handleRemove = (tr: Transaction) => {
    if (workbook) {
      dispatch(Actions.removeTransaction({ workbookId: workbook.id, id: tr.id }));
    }
  };

  const handleEdit = (tr: Transaction) => {
    setEditable(tr);
  };

  const handleAdd = () => {
    setEditable({});
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  return (
    <>
      <Title sx={{ display: 'flex', alignItems: 'baseline' }}>
        <span>Transactions</span>
        <Button onClick={handleAdd}>Add</Button>
      </Title>
      {editable && <ContractEditor open contract={fromTransaction(editable)} onClose={handleClose} />}
      <TransactionsTable onRemove={handleRemove} onEdit={handleEdit} />
    </>
  );
};
