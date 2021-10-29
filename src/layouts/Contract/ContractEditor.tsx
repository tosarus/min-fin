import React, { useState } from 'react';
import currency from 'currency.js';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Selectors } from '../../store';
import { TransactionType } from '../../types';
import { getAssetAccountIds } from '../Accounts/utils';
import { Contract } from './Contract';
import { getAccountIdsByCategory, transactionTypes } from './utils';

interface ContractEditorProps {
  open: boolean;
  contract: Contract;
  onClose: () => void;
  onSubmit: (contract: Contract) => void;
}

export const ContractEditor = ({ open: initOpen, contract, onClose, onSubmit }: ContractEditorProps) => {
  const [open, setOpen] = useState(initOpen);
  const accountMap = useSelector(Selectors.currentAccountMap);
  const accounts = useSelector(Selectors.currentAccounts) ?? [];

  const handleSubmit = (contract: Contract) => {
    setOpen(false);
    onSubmit(contract);
  };

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  const formik = useFormik({
    initialValues: contract,
    onSubmit: handleSubmit,
  });

  const handleTypeChange = (e: React.MouseEvent, newType: TransactionType) => {
    formik.setFieldValue('type', newType);
    if (newType === TransactionType.Opening) {
      formik.setFieldValue('otherAccount', 0);
    }
  };

  const handleAmoutBlur = (e: React.FocusEvent) => {
    formik.setFieldValue('amount', currency(formik.values.amount ?? '0').format());
    formik.handleBlur(e);
  };

  const idToAccount = (id: string) => accountMap.get(id)?.name ?? '';

  const sxLeft = { mb: 2, mr: 2, flex: '1 0 350px' };
  const sxRight = { mb: 2, flex: '1 0 170px' };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth sx={{ pb: '10%' }}>
      <DialogTitle>{contract.id ? 'Edit' : 'Add'} Transaction</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexFlow: 'row wrap', pb: 1 }}>
        <Autocomplete
          fullWidth
          disableClearable
          sx={{ mb: 2, mt: 0.75 }}
          id="contract-account"
          options={getAssetAccountIds(accounts)}
          getOptionLabel={idToAccount}
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
        <TextField id="contract-description" label="Description" sx={sxLeft} {...formik.getFieldProps('description')} />
        <TextField id="contract-date" type="date" label="Date" sx={sxRight} {...formik.getFieldProps('date')} />
        <Autocomplete
          disableClearable
          disabled={formik.values.type === TransactionType.Opening}
          sx={sxLeft}
          id="contract-category"
          options={getAccountIdsByCategory(accounts, formik.values.account ?? 0, formik.values.type)}
          getOptionLabel={idToAccount}
          value={formik.values.otherAccount}
          onChange={(e, value) => formik.setFieldValue('otherAccount', value)}
          renderInput={(params) => (
            <TextField
              label={formik.values.type === TransactionType.Transfer ? 'Destination Account' : 'Category'}
              variant={params.disabled ? 'filled' : 'outlined'}
              {...params}
            />
          )}
        />
        <TextField
          id="contract-amount"
          label="Amount"
          sx={sxRight}
          {...formik.getFieldProps('amount')}
          onBlur={handleAmoutBlur}
        />
        <TextField id="contract-detail" fullWidth multiline rows={2} label="Details" {...formik.getFieldProps('detail')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
