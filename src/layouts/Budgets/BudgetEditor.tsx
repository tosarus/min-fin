import React from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { TextField, Typography } from '@mui/material';
import { AccountSelect, AmountSpan, EditorDialog } from '../../common';
import { Selectors } from '../../store';
import { Account, BudgetAccount } from '../../types';
import { amountOrZero, formatMonth, getBudgetAccountIds, positiveAmount } from '../utils';

interface BudgetEditorProps {
  budget: Partial<BudgetAccount>;
  planned: BudgetAccount[];
  onClose: () => void;
  onSubmit: (budget: Partial<BudgetAccount>) => void;
  onRemove: (budgetId?: string) => void;
}

export const BudgetEditor = ({ budget, planned, onClose, onSubmit, onRemove }: BudgetEditorProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const accountMap = useSelector(Selectors.currentAccountMap);

  const formik = useFormik({
    initialValues: { ...budget, amount: positiveAmount(budget.amount ?? '') },
    onSubmit,
    validate: (values) => {
      const errors = {} as Partial<BudgetAccount>;
      if (!values.account_id) {
        errors.account_id = 'Required';
      }
      return errors;
    },
  });

  const handleAmountBlur = (e: React.FocusEvent) => {
    formik.setFieldValue('amount', amountOrZero(formik.values.amount));
    formik.handleBlur(e);
  };

  const handleRemove = budget.id ? () => onRemove(budget.id) : undefined;

  const idToAccount = (id: string) => accountMap.get(id)?.name ?? '';

  const hasErrors = () => !!Object.values(formik.errors).find((value) => !!value);
  const isTouched = () => !!Object.values(formik.touched).find((value) => !!value);
  const canSubmit = !hasErrors() && isTouched();

  return (
    <EditorDialog
      title={
        (!budget.id ? 'Creating budget' : 'Editing budget') +
        (budget.account_id ? ` for ${idToAccount(budget.account_id)}` : '')
      }
      sx={{ display: 'flex', flexFlow: 'column' }}
      canSubmit={canSubmit}
      onClose={onClose}
      onSubmit={() => formik.handleSubmit()}
      onRemove={handleRemove}>
      <AccountSelect
        fullWidth
        disabled={!!budget.account_id}
        sx={{ mb: 2, mt: 0.75 }}
        options={getUnplannedAccountIds(accounts, planned)}
        value={formik.values.account_id}
        onChange={(value) => {
          formik.setFieldValue('account_id', value);
          formik.setFieldTouched('account_id', true);
        }}
        label="Category"
        error={formik.errors.account_id}
      />
      <TextField label="Amount" {...formik.getFieldProps('amount')} onBlur={handleAmountBlur} />
      {!budget.id && budget.amount && (
        <Typography>
          <span>{budget.amount.includes('-') ? 'Spent ' : 'Earned '}</span>
          <AmountSpan amount={budget.amount} />
          <span> in {formatMonth(budget.month)}</span>
        </Typography>
      )}
    </EditorDialog>
  );
};

function getUnplannedAccountIds(accounts: Account[], planned: BudgetAccount[]) {
  const plannedIds = new Set(planned.map((b) => b.account_id));
  return getBudgetAccountIds(accounts).filter((id) => !plannedIds.has(id));
}
