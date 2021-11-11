import React from 'react';
import currency from 'currency.js';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AccountSelect, EditorDialog } from '../../common';
import { Selectors } from '../../store';
import { TransactionType } from '../../types';
import { getAssetAccountIds } from '../Accounts/utils';
import { Contract } from './Contract';
import { getAccountIdsByCategory, transactionTypes } from './utils';

interface ContractEditorProps {
  contract: Contract;
  onClose: () => void;
  onSubmit: (contract: Contract) => void;
}

export const ContractEditor = ({ contract, onClose, onSubmit }: ContractEditorProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];

  const formik = useFormik({
    initialValues: contract,
    onSubmit,
    validate: (values) => {
      const errors = {} as Partial<Contract>;
      if (!values.account) {
        errors.account = 'Required';
      }
      if (!values.description) {
        errors.description = 'Required';
      }
      if (!values.otherAccount && values.type !== TransactionType.Opening) {
        errors.otherAccount = 'Required';
      }
      return errors;
    },
  });

  const handleTypeChange = (e: React.MouseEvent, newType: TransactionType) => {
    newType = newType ?? TransactionType.Expence;
    formik.setFieldValue('otherAccount', undefined);
    formik.setFieldValue('type', newType);
  };

  const handleAmoutBlur = (e: React.FocusEvent) => {
    formik.setFieldValue('amount', currency(formik.values.amount ?? '0').format());
    formik.handleBlur(e);
  };

  const sxLeft = { mb: 2, mr: 2, flex: '1 0 350px' };
  const sxRight = { mb: 2, flex: '1 0 170px' };

  const hasErrors = () => !!Object.values(formik.errors).find((value) => !!value);
  const isTouched = () => !!Object.values(formik.touched).find((value) => !!value);
  const canSubmit = !hasErrors() && isTouched();

  return (
    <EditorDialog
      title={`${contract.id ? 'Edit' : 'Add'} Transaction`}
      sx={{ display: 'flex', flexFlow: 'row wrap', pb: 1 }}
      canSubmit={canSubmit}
      onClose={onClose}
      onSubmit={() => formik.handleSubmit()}>
      <AccountSelect
          fullWidth
          sx={{ mb: 2, mt: 0.75 }}
          options={getAssetAccountIds(accounts)}
          value={formik.values.account}
        onChange={(value) => formik.setFieldValue('account', value)}
        label="Account"
        error={formik.errors.account}
        />
        <ToggleButtonGroup
          fullWidth
          exclusive
          color="primary"
          sx={{ mb: 2 }}
          value={formik.values.type}
          onChange={handleTypeChange}
          id="contract-type">
          {transactionTypes().map((type, i) => (
            <ToggleButton key={i} value={type}>
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <TextField
          label="Description"
          placeholder={formik.errors.description}
          error={!!formik.errors.description}
          sx={sxLeft}
          {...formik.getFieldProps('description')}
        />
        <TextField id="contract-date" type="date" label="Date" sx={sxRight} {...formik.getFieldProps('date')} />
      <AccountSelect
          disabled={formik.values.type === TransactionType.Opening}
          sx={sxLeft}
          options={getAccountIdsByCategory(accounts, formik.values.account ?? 0, formik.values.type)}
          value={formik.values.otherAccount}
        onChange={(value) => formik.setFieldValue('otherAccount', value)}
              label={formik.values.type === TransactionType.Transfer ? 'Destination Account' : 'Category'}
        error={formik.errors.otherAccount}
            />
      <TextField label="Amount" sx={sxRight} {...formik.getFieldProps('amount')} onBlur={handleAmoutBlur} />
      <TextField fullWidth multiline rows={2} label="Details" {...formik.getFieldProps('detail')} />
    </EditorDialog>
  );
};
