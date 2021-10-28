import React, { useState } from 'react';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
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
import { Actions, Selectors } from '../../store';
import { BudgetAccount, getBudgetAccountTypes } from '../../types';

interface BudgetEditorProps {
  open: boolean;
  budget: Partial<BudgetAccount>;
  onClose?: () => void;
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

export const BudgetEditor = ({ open: initOpen, budget, onClose = () => {} }: BudgetEditorProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(initOpen);

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = (budget: Partial<BudgetAccount>) => {
    setOpen(false);
    if (workbook) {
      dispatch(Actions.saveBudget({ workbookId: workbook.id, budget }));
    }

    onClose();
  };

  const formik = useFormik({
    initialValues: { ...budget, amount: makePositive(budget.amount) },
    onSubmit: handleSubmit,
  });

  const handleAmoutBlur = (e: React.FocusEvent) => {
    formik.setFieldValue('amount', currency(formik.values.amount ?? '0').format());
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
      <DialogContent sx={{ display: 'flex', flexFlow: 'column', pb: 1 }}>
        <Autocomplete
          fullWidth
          disableClearable
          disabled={!!budget.account_id}
          sx={{ mb: 2 }}
          id="budget-account"
          options={getBudgetAccountTypes()}
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
