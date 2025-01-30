import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Transaction } from '../../types';
import { Contract, ContractEditor, fromContract, fromTransaction } from '../Contract';
import { TransactionTable } from './TransactionTable';

export const TransactionList = () => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<Transaction>>();

  const handleEdit = (tr: Transaction) => {
    setEditable(tr);
  };

  const handleAdd = () => {
    setEditable({});
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  const handleSubmit = (contract: Contract) => {
    if (workbook) {
      dispatch(Actions.saveTransaction({ workbookId: workbook.id, trans: fromContract(accounts, contract) }));
    }
    setEditable(undefined);
  };

  const handleRemove = (tranId?: string) => {
    if (workbook && tranId) {
      dispatch(Actions.removeTransaction({ workbookId: workbook.id, id: tranId }));
    }
  };

  return (
    <>
      <Title sx={{ display: 'flex', alignItems: 'baseline' }}>
        <span>Transactions</span>
        <Button onClick={handleAdd}>Add</Button>
      </Title>
      {editable && (
        <ContractEditor
          contract={fromTransaction(editable)}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onRemove={handleRemove}
        />
      )}
      <TransactionTable onEdit={handleEdit} />
    </>
  );
};
