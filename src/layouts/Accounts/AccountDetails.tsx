import React from 'react';
import { useFormik } from 'formik';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { amountSpanStyle, EditorLine, Title } from '../../common';
import { Account, AccountType } from '../../types';
import { accountTypeName, editableAccountTypes } from './utils';

interface AccountDetailsProps {
  account: Partial<Account>;
  onSubmit: (updated: Partial<Account>) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export const AccountDetails = ({
  account: { id, name = '', type, balance = '0' },
  onSubmit,
  onCancel = () => {},
  onDelete = () => {},
}: AccountDetailsProps) => {
  const formik = useFormik({
    initialValues: { id, name, type, balance },
    onSubmit,
    enableReinitialize: true,
    validate: (values) => {
      const errors = {} as Partial<Account>;
      if (!values.name) {
        errors.name = 'Required';
      }
      return errors;
    },
  });

  const addingNew = !id;
  const canSubmit = (formik.touched.name || formik.touched.type) && !formik.errors.name;

  return (
    <Box sx={{ mb: 2 }} component="form" onSubmit={formik.handleSubmit} noValidate>
      <Title sx={{ textAlign: 'left' }}>{addingNew ? 'Create New Account' : 'Details'}</Title>
      <EditorLine label="Name" htmlFor="account-name">
        <TextField
          fullWidth
          inputRef={(input) => addingNew && input && input.focus()}
          error={!!formik.errors.name}
          id="account-name"
          size="small"
          variant="standard"
          name="name"
          value={formik.values.name}
          onChange={(e) => {
            formik.setFieldTouched('name');
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
        />
      </EditorLine>
      <EditorLine label="Type" htmlFor="account-type">
        <Autocomplete
          fullWidth
          disablePortal
          disableClearable
          id="account-type"
          size="small"
          getOptionLabel={(option: AccountType) => accountTypeName(option)}
          options={editableAccountTypes()}
          value={formik.values.type}
          onChange={(e, value) => {
            formik.setFieldValue('type', value);
            formik.setFieldTouched('type', value !== type);
          }}
          renderInput={(params) => <TextField {...params} name="type" variant="standard" />}
        />
      </EditorLine>
      <EditorLine label="Balance" htmlFor="account-balance" sx={{ mb: 1 }}>
        <TextField
          fullWidth
          id="account-balance"
          size="small"
          value={balance}
          disabled={addingNew}
          variant="standard"
          InputProps={{
            readOnly: true,
            sx: { ...amountSpanStyle(balance) },
          }}
        />
      </EditorLine>
      <Box sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-around' }}>
        <Button disabled={!canSubmit} type="submit">
          Save
        </Button>
        <Button disabled={addingNew} onClick={onDelete}>
          Delete
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};
