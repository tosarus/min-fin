import React, { KeyboardEvent, useState } from 'react';
import { useFormik } from 'formik';
import { Box, BoxProps, TextField } from '@mui/material';

interface Props {
  value: string;
  name?: string;
  editing?: boolean;
  onChanged: (name: string) => void;
  onCancel?: () => void;
}

const Editor = ({ sx, value, name, onChanged, onCancel = () => {} }: Props & BoxProps) => {
  const formik = useFormik({
    initialValues: { value },
    onSubmit: ({ value }) => {
      onChanged(value);
    },
  });

  const handleLostFocus = () => {
    onCancel();
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleLostFocus();
    }
  };

  return (
    <Box sx={{ display: 'flex', ...sx }} component="form" onSubmit={formik.handleSubmit} onKeyDown={handleEscape}>
      <TextField
        sx={{ flex: '1 0 auto' }}
        id="editable-string"
        label={name}
        value={formik.values.value}
        onChange={formik.handleChange}
        name="value"
        size="small"
        variant="standard"
        onBlur={handleLostFocus}
      />
    </Box>
  );
};

export const EditableString = ({ editing = false, onChanged, onCancel = () => {}, ...rest }: Props & BoxProps) => {
  const [edit, setEdit] = useState(editing);
  const { sx, value } = rest;
  const handleChanged = (value: string) => {
    setEdit(false);
    onChanged(value);
  };
  const handleCancel = () => {
    setEdit(false);
    onCancel();
  };

  return edit ? (
    <Editor {...rest} onChanged={handleChanged} onCancel={handleCancel} />
  ) : (
    <Box sx={{ ...sx, py: 1 }} onClick={() => setEdit(true)}>
      {value}
    </Box>
  );
};
