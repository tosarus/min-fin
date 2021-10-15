import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Selectors } from '../../store';
import { Transaction } from '../../types';
import { Contract, fromContract, toContract } from './Contract';
import { ContractEditor } from './ContractEditor';

interface TransactionDialogProps {
  open: boolean;
  value: Partial<Transaction>;
  onCancel: () => void;
  onSave: (tr: Partial<Transaction>) => void;
}

export const TransactionDialog = ({ open, value, onCancel, onSave }: TransactionDialogProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];

  const handleSubmit = (contract: Contract) => {
    onSave(fromContract(accounts, contract));
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle>{value.id ? 'Edit' : 'Add'} Transaction</DialogTitle>
      <DialogContent>
        <ContractEditor contract={toContract(value)} onCancel={onCancel} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
