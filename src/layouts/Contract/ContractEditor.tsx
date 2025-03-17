import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Checkbox, FormControlLabel, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AccountSelect, EditorDialog } from '../../common';
import { Selectors } from '../../store';
import { AccountType, CashFlow, dateOrderCompare, TransactionType } from '../../types';
import {
  amountOrZero,
  getAccountIdsByCategory,
  getAccountType,
  getAssetAccountIds,
  positiveAmount,
  transactionTypes,
} from '../utils';
import { Contract } from './Contract';

interface ContractEditorProps {
  contract: Contract;
  onClose: () => void;
  onSubmit: (contract: Contract) => void;
  onRemove: (id?: string) => void;
}

const buildCategorySuggestions = (cashFlows: CashFlow[]) => {
  const suggestions = new Map<string, { account: string; type: TransactionType; amount?: string }>();
  for (const flow of [...cashFlows].sort(dateOrderCompare)) {
    if (flow.type === TransactionType.Opening || suggestions.has(flow.description)) {
      continue;
    }
    const amount = flow.recurring ? positiveAmount(flow.amount) : undefined;
    if (flow.type === TransactionType.Transfer) {
      suggestions.set(flow.description, { account: flow.account_id, type: flow.type, amount });
    } else {
      suggestions.set(flow.description, { account: flow.other_account_id, type: flow.type, amount });
    }
  }
  return suggestions;
};

export const ContractEditor = ({ contract, onClose, onSubmit, onRemove }: ContractEditorProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const categorySuggestions = useMemo(() => buildCategorySuggestions(cashFlows), [cashFlows]);

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

  const handleAmountBlur = (e: React.FocusEvent) => {
    formik.setFieldValue('amount', amountOrZero(formik.values.amount));
    formik.handleBlur(e);
  };

  const handleDescriptionBlur = (e: React.FocusEvent) => {
    if (formik.values.type === TransactionType.Opening || !formik.values.description || formik.values.otherAccount) {
      return;
    }

    const suggestion = categorySuggestions.get(formik.values.description);
    if (suggestion) {
      if (suggestion.amount) {
        formik.setFieldValue('amount', suggestion.amount);
      }
      formik.setFieldValue('type', suggestion.type);
      if (
        suggestion.type !== TransactionType.Transfer ||
        getAccountType(accounts, formik.values.account) === AccountType.Banking
      ) {
        formik.setFieldValue('otherAccount', suggestion.account);
      } else if (formik.values.account !== suggestion.account) {
        // swap accounts for transfers to credit account
        const myAccount = formik.values.account;
        formik.setFieldValue('account', suggestion.account);
        formik.setFieldValue('otherAccount', myAccount);
      }
    }

    formik.handleBlur(e);
  };

  const handleRemove = contract.id ? () => onRemove(contract.id) : undefined;

  const updateFormik = (name: string, value: any) => {
    formik.setFieldValue(name, value);
    formik.setFieldTouched(name);
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
      onSubmit={() => formik.handleSubmit()}
      onRemove={handleRemove}>
      <AccountSelect
        fullWidth
        sx={{ mb: 2, mt: 0.75 }}
        options={getAssetAccountIds(accounts)}
        value={formik.values.account}
        onChange={(value) => updateFormik('account', value)}
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
        onBlur={handleDescriptionBlur}
      />
      <TextField type="date" label="Date" sx={sxRight} {...formik.getFieldProps('date')} />
      <AccountSelect
        disabled={formik.values.type === TransactionType.Opening}
        sx={sxLeft}
        options={getAccountIdsByCategory(accounts, formik.values.account ?? '', formik.values.type)}
        value={formik.values.otherAccount}
        onChange={(value) => updateFormik('otherAccount', value)}
        label={formik.values.type === TransactionType.Transfer ? 'Destination Account' : 'Category'}
        error={formik.errors.otherAccount}
      />
      <TextField label="Amount" sx={sxRight} {...formik.getFieldProps('amount')} onBlur={handleAmountBlur} />
      <TextField fullWidth multiline rows={2} label="Details" {...formik.getFieldProps('detail')} />
      <FormControlLabel
        control={
          <Checkbox checked={formik.values.recurring} onChange={(e, checked) => updateFormik('recurring', checked)} />
        }
        label="Recurring"
        sx={{ ml: 'auto' }}
      />
      <FormControlLabel
        control={<Checkbox checked={formik.values.pending} onChange={(e, checked) => updateFormik('pending', checked)} />}
        label="Pending"
      />
    </EditorDialog>
  );
};
