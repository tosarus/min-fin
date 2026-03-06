import React, { useState } from 'react';
import { Autocomplete, Chip, SxProps, TextField } from '@mui/material';

interface ArrayAutocompleteProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
  label?: string;
  fullWidth?: boolean;
  sx?: SxProps;
}

const sanitizeValue = (v: string) => v.replace(/[^a-zA-Z0-9 ]/g, '').trim();

export const ArrayAutocomplete = ({ value, onChange, options = [], label, fullWidth, sx }: ArrayAutocompleteProps) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const focusedPlaceholder = "  Press 'Enter' to add";
  const currentPlaceholder = focused ? focusedPlaceholder : value.length === 0 ? '  ' + label : undefined;

  const commit = (input: string) => {
    const tag = sanitizeValue(input);
    if (tag) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  return (
    <Autocomplete
      fullWidth={fullWidth}
      sx={sx}
      multiple
      freeSolo
      options={options}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, v) => setInputValue(v)}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        commit(inputValue);
      }}
      onChange={(_, newValue) => onChange(newValue.map(sanitizeValue).filter(Boolean))}
      renderValue={(items, getItemProps) =>
        items.map((option, index) => <Chip {...getItemProps({ index })} key={index} label={option} size="small" />)
      }
      renderInput={(params) => (
        <TextField
          variant="standard"
          {...params}
          placeholder={currentPlaceholder}
          sx={{ '& .MuiInput-underline:before': { border: 'none' } }}
        />
      )}
    />
  );
};
