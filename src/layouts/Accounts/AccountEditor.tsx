import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Actions, Selectors } from '../../store';
import { Account, AccountType, getBudgetAccountTypes, getPublicAccountTypes } from '../../types';
import { accountTypeName, sortAccounts } from './utils';

interface AccountEditorProps {
  open: boolean;
  account: Partial<Account>;
  onClose?: () => void;
}

export const AccountEditor = ({
  open: initOpen,
  account: { id, name = '', type, parent_id },
  onClose = () => {},
}: AccountEditorProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(initOpen);
  const isGroup = !!accounts.find((acc) => acc.parent_id === id);

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  const removeParent = '<none>';

  const handleSubmit = (account: Partial<Account>) => {
    setOpen(false);
    if (workbook) {
      if (!account.parent_id || account.parent_id === removeParent) {
        delete account.parent_id;
      }
      dispatch(Actions.saveAccount({ workbookId: workbook.id, account }));
    }

    onClose();
  };

  const formik = useFormik({
    initialValues: { id, name, type, parent_id },
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

  const getParentOptions = () => [
    '',
    ...sortAccounts(
      accounts.filter((acc) => acc.id !== id && !acc.parent_id),
      formik.values.type
    ).map((acc) => acc.id),
  ];
  const idToAccount = (id: string) => (!id ? removeParent : accountMap.get(id)?.name ?? '');

  const editableParent = !isGroup && formik.values.type && getBudgetAccountTypes().includes(formik.values.type);

  const addingNew = !id;
  const canSubmit = (formik.touched.name || formik.touched.parent_id || formik.touched.type) && !formik.errors.name;

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
        <Autocomplete
          fullWidth
          disableClearable
          disabled={!editableParent}
          sx={{ mb: 2 }}
          id="account-parent"
          options={getParentOptions()}
          getOptionLabel={idToAccount}
          value={formik.values.parent_id}
          onChange={(e, value) => {
            formik.setFieldValue('parent_id', value);
            formik.setFieldTouched('parent_id', true);
          }}
          renderInput={(params) => (
            <TextField label="Parent" variant={params.disabled ? 'filled' : 'outlined'} {...params} />
          )}
        />
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
