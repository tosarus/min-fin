import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Account, AccountType, getPublicAccountTypes } from '../../types';
import { accountTypeName } from './utils';

interface AccountEditorProps {
  open: boolean;
  account: Partial<Account>;
  onClose: () => void;
  onSubmit: (account: Partial<Account>) => void;
}

export const AccountEditor = ({
  open: initOpen,
  account: { id, name = '', type },
  onClose,
  onSubmit,
}: AccountEditorProps) => {
  const [open, setOpen] = useState(initOpen);

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  const handleSubmit = (account: Partial<Account>) => {
    setOpen(false);
    onSubmit(account);
  };

  const formik = useFormik({
    initialValues: { id, name, type },
    onSubmit: handleSubmit,
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

  const addingNew = !id;
  const canSubmit = (formik.touched.name || formik.touched.type) && !formik.errors.name;

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth sx={{ pb: '10%' }}>
      <DialogTitle>
        {addingNew ? 'Add' : 'Edit'} {accountTypeName(formik.values.type!)}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexFlow: 'column', pb: 1 }}>
        <ToggleButtonGroup
          fullWidth
          exclusive
          color="primary"
          sx={{ mb: 2 }}
          value={formik.values.type}
          onChange={handleTypeChange}
          id="account-type">
          {getPublicAccountTypes().map((type, i) => (
            <ToggleButton key={i} value={type}>
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <TextField
          fullWidth
          id="account-name"
          label="Name"
          error={!!formik.errors.name}
          {...formik.getFieldProps('name')}
          onChange={(e) => {
            formik.setFieldTouched('name');
            formik.handleChange(e);
          }}
        />
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
