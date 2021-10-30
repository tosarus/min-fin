import React, { useState } from 'react';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { BudgetAccount, getBudgetAccountTypes } from '../../types';
import { getAccountIds } from '../Accounts/utils';

interface BudgetEditorProps {
  open: boolean;
  budget: Partial<BudgetAccount>;
  onClose: () => void;
  onSubmit: (budget: Partial<BudgetAccount>) => void;
}

const makePositive = (amount?: string) => {
  if (!amount) {
    return amount;
  }

  let value = currency(amount);
  if (value.intValue < 0) {
    value = value.multiply(-1);
  }
  return value.format();
};

export const BudgetEditor = ({ open: initOpen, budget, onClose, onSubmit }: BudgetEditorProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const accountMap = useSelector(Selectors.currentAccountMap);
  const [open, setOpen] = useState(initOpen);

  const handleCancel = () => {
    onClose();
    setOpen(false);
  };

  const handleSubmit = (budget: Partial<BudgetAccount>) => {
    onSubmit(budget);
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: { ...budget, amount: makePositive(budget.amount) },
    onSubmit: handleSubmit,
  });

  const handleAmoutBlur = (e: React.FocusEvent) => {
    formik.setFieldValue('amount', formik.values.amount ? currency(formik.values.amount).format() : null);
    formik.handleBlur(e);
  };

  const idToAccount = (id: string) => accountMap.get(id)?.name ?? '';
  const canSubmit = !!(formik.values.account_id && formik.touched);

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth sx={{ pb: '10%' }}>
      <DialogTitle>
        {(!budget.id ? 'Creating budget' : 'Editing budget') +
          (budget.account_id ? ` for ${idToAccount(budget.account_id)}` : '')}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexFlow: 'column' }}>
        <Autocomplete
          fullWidth
          disableClearable
          disabled={!!budget.account_id}
          sx={{ mb: 2, mt: 0.75 }}
          id="budget-account"
          options={getAccountIds(accounts, ...getBudgetAccountTypes())}
          getOptionLabel={idToAccount}
          value={formik.values.account_id}
          onChange={(e, value) => {
            formik.setFieldValue('account_id', value);
            formik.setFieldTouched('account_id', true);
          }}
          renderInput={(params) => (
            <TextField label="Category" variant={params.disabled ? 'filled' : 'outlined'} {...params} />
          )}
        />
        <TextField
          sx={{ mb: 2 }}
          id="budget-amount"
          label="Amount"
          {...formik.getFieldProps('amount')}
          onBlur={handleAmoutBlur}
        />
        {!budget.id && budget.amount && (
          <Typography>
            <span>{budget.amount.includes('-') ? 'Spent ' : 'Earned '}</span>
            <AmountSpan amount={budget.amount} />
            {dayjs(budget.month).format(' in MMMM, YYYY')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={!canSubmit} onClick={() => formik.handleSubmit()}>
          Save
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
