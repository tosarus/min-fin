import React from 'react';
import { useFormik } from 'formik';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { amountSpanStyle, Title } from '../../common';
import { Account, AccountType } from '../../types';
import { accountTypeName, editableAccountTypes } from './utils';

interface LineProps {
  label: string;
  htmlFor: string;
  children: React.ReactChild;
}

const PropertyLine = ({ label, htmlFor, children }: LineProps) => {
  return (
    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', mb: 2 }}>
      <Typography component="label" htmlFor={htmlFor} sx={{ pr: 2, flex: '0 1 auto', width: 100 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};

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
  const addingNew = !id;

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

  return (
    <Box sx={{ flexGrow: 1 }} component="form" onSubmit={formik.handleSubmit} noValidate>
      <Title>{addingNew ? 'Create New Account' : 'Details'}</Title>
      <PropertyLine label="Name" htmlFor="account-name">
        <TextField
          fullWidth
          inputRef={(input) => addingNew && input && input.focus()}
          error={!!formik.errors.name}
          id="account-name"
          size="small"
          name="name"
          value={formik.values.name}
          onChange={(e) => {
            formik.setFieldTouched('name');
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          variant="standard"
          helperText={formik.errors.name}
        />
      </PropertyLine>
      <PropertyLine label="Type" htmlFor="account-type">
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
      </PropertyLine>
      <PropertyLine label="Balance" htmlFor="account-balance">
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
      </PropertyLine>

      <Box sx={{ display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-around' }}>
        {(formik.touched.name || formik.touched.type) && !formik.errors.name && (
          <Button type="submit">{addingNew ? 'Create' : 'Update'}</Button>
        )}
        {addingNew ? <Button onClick={onCancel}>Cancel</Button> : <Button onClick={onDelete}>Delete</Button>}
      </Box>
    </Box>
  );
};
