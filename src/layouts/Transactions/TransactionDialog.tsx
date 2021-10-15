import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Transaction } from '../../types';
import { TransactionEditor } from './TransactionEditor';

interface TransactionDialogProps {
  open: boolean;
  value: Partial<Transaction>;
  onCancel: () => void;
  onSave: (tr: Partial<Transaction>) => void;
}

export const TransactionDialog = ({ open, ...rest }: TransactionDialogProps) => {
  return (
    <Dialog open={open} onClose={rest.onCancel} fullWidth>
      <DialogTitle>{rest.value.id ? 'Edit' : 'Add'} Transaction</DialogTitle>
      <DialogContent>
        <TransactionEditor {...rest} />
      </DialogContent>
    </Dialog>
  );
};
