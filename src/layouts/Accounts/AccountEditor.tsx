import React from 'react';
import { useFormik } from 'formik';
import { TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { EditorDialog } from '../../common';
import { Account, AccountType, getPublicAccountTypes } from '../../types';
import { accountTypeName } from '../utils';

interface AccountEditorProps {
  account: Partial<Account>;
  onClose: () => void;
  onSubmit: (account: Partial<Account>) => void;
  onRemove?: () => void;
}

export const AccountEditor = ({ account: { id, name = '', type }, onClose, onSubmit, onRemove }: AccountEditorProps) => {
  const formik = useFormik({
    initialValues: { id, name, type },
    onSubmit,
    validate: (values) => {
      const errors = {} as Partial<Account>;
      if (!values.name) {
        errors.name = 'Required';
      }
      return errors;
    },
  });

  const handleTypeChange = (e: React.MouseEvent, newType: AccountType) => {
    formik.setFieldValue('type', newType);
  };

  const hasErrors = () => !!Object.values(formik.errors).find((value) => !!value);
  const isTouched = () => !!Object.values(formik.touched).find((value) => !!value);
  const canSubmit = !hasErrors() && isTouched();

  return (
    <EditorDialog
      title={`${id ? 'Edit' : 'Add'}  ${accountTypeName(formik.values.type)}`}
      sx={{ display: 'flex', flexFlow: 'column', pb: 1 }}
      canSubmit={canSubmit}
      onClose={onClose}
      onSubmit={() => formik.handleSubmit()}
      onRemove={onRemove}>
      <ToggleButtonGroup
        fullWidth
        exclusive
        color="primary"
        sx={{ mb: 2 }}
        value={formik.values.type}
        onChange={handleTypeChange}>
        {getPublicAccountTypes().map((type, i) => (
          <ToggleButton key={i} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <TextField
        fullWidth
        label="Name"
        placeholder={formik.errors.name}
        error={!!formik.errors.name}
        {...formik.getFieldProps('name')}
        onChange={(e) => {
          formik.setFieldTouched('name');
          formik.handleChange(e);
        }}
      />
    </EditorDialog>
  );
};
