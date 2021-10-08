import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { accountTypeName, editableAccountTypes } from './utils';
import { Account } from '../../types';

export interface AccountEditProps {
  account: Partial<Account>;
  onSubmit: (account: Partial<Account>) => void;
  onCancel: () => void;
}

export const AccountEdit = ({ account, onCancel, onSubmit }: AccountEditProps) => {
  const formik = useFormik({
    initialValues: account,
    onSubmit,
  });

  return (
    <>
      <Typography variant="h6">{account.id ? 'Edit' : 'Adding new'}</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          sx={{ my: 1 }}
          id="account-name"
          name="name"
          label="Account Name"
          size="small"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel id="account-type-label">Account Type</InputLabel>
          <Select
            id="account-type"
            labelId="account-type-label"
            name="type"
            size="small"
            label="Account Type"
            value={formik.values.type}
            onChange={formik.handleChange}>
            {editableAccountTypes().map((type) => (
              <MenuItem key={type} value={type}>
                {accountTypeName(type)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </>
  );
};
