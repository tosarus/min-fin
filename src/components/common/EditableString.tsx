import React, { FormEvent, KeyboardEvent, useState } from 'react';
import { Box, TextField } from '@material-ui/core';

interface EditableStringProps {
  value: string;
  name: string;
  editing?: boolean;
  onChanged: (name: string) => void;
  onCancel?: () => void;
}

export const EditableString = ({
  value: initialValue,
  name,
  editing = false,
  onChanged,
  onCancel = () => {},
}: EditableStringProps) => {
  const [edit, setEdit] = useState(editing);
  const [value, setValue] = useState(initialValue);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEdit(false);
    onChanged(value);
  };
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setValue(initialValue);
      setEdit(false);
      onCancel();
    }
  };

  return edit ? (
    <Box component="form" display="flex" onSubmit={handleSubmit} onKeyDown={handleEscape}>
      <TextField
        style={{ flex: '1 0 auto' }}
        id="user-name"
        label={name}
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
      />
    </Box>
  ) : (
    <Box component="span" onClick={() => setEdit(true)}>
      {value}
    </Box>
  );
};
