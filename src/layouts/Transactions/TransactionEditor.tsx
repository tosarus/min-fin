import React from 'react';
import currency from 'currency.js';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Autocomplete, Box, Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Selectors } from '../../store';
import { Transaction, TransactionType } from '../../types';
import {
  contractToTransaction,
  getAccountIdsByCategory,
  getAssetAccountIds,
  transactionToContract,
  transactionTypes,
} from './utils';

interface TransactionEditorProps {
  value: Partial<Transaction>;
  onCancel: () => void;
  onSave: (tr: Partial<Transaction>) => void;
}

export const TransactionEditor = ({ value, onCancel, onSave }: TransactionEditorProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const formik = useFormik({
    initialValues: transactionToContract(value),
    onSubmit: (contract) => {
      onSave(contractToTransaction(accounts, contract));
    },
  });

  const handleTypeChange = (e: React.MouseEvent, newType: TransactionType) => {
    formik.setFieldValue('type', newType);
    if (newType === TransactionType.Opening) {
      formik.setFieldValue('otherAccount', 0);
    }
  };

  return (
    <Box sx={{ pt: 0.75, display: 'flex', flexFlow: 'row wrap' }}>
      <Autocomplete
        fullWidth
        disablePortal
        disableClearable
        sx={{ mb: 2 }}
        id="contract-account"
        options={getAssetAccountIds(accounts)}
        getOptionLabel={(id: number) => accountMap.get(id)?.name ?? ''}
        value={formik.values.account}
        onChange={(e, value) => formik.setFieldValue('account', value)}
        renderInput={(params) => <TextField label="Account" {...params} />}
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
        id="contract-description"
        label="Description"
        sx={{ mb: 2, mr: 2, flex: '1 0 350px' }}
        {...formik.getFieldProps('description')}
      />
      <TextField
        id="contract-date"
        type="date"
        label="Date"
        sx={{ mb: 2, flex: '1 0 170px' }}
        {...formik.getFieldProps('date')}
      />
      <Autocomplete
        disableClearable
        disabled={formik.values.type === TransactionType.Opening}
        sx={{ mb: 2, mr: 2, flex: '1 0 350px' }}
        id="contract-category"
        options={getAccountIdsByCategory(accounts, formik.values.account ?? 0, formik.values.type)}
        getOptionLabel={(id: number) => accountMap.get(id)?.name ?? ''}
        value={formik.values.otherAccount}
        onChange={(e, value) => formik.setFieldValue('otherAccount', value)}
        renderInput={(params) => (
          <TextField
            label={formik.values.type === TransactionType.Transfer ? 'Destination Account' : 'Category'}
            variant={params.disabled ? 'filled' : 'outlined'}
            name="otherAccount"
            {...params}
          />
        )}
      />
      <TextField
        id="contract-amount"
        name="amount"
        label="Amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        onBlur={(e) => {
          formik.setFieldValue('amount', currency(formik.values.amount ?? '0').format());
          formik.handleBlur(e);
        }}
        sx={{ mb: 2, flex: '1 0 170px' }}
      />
      <TextField
        id="contract-details"
        fullWidth
        multiline
        rows={2}
        label="Details"
        sx={{ mb: 2 }}
        {...formik.getFieldProps('details')}
      />
      <Box>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};
