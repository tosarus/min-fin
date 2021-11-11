import React from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete, TextField } from '@mui/material';
import { SxProps } from '@mui/system';
import { Selectors } from '../store';

interface AccountSelectProps {
  fullWidth?: boolean;
  sx?: SxProps;
  disabled?: boolean;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}
export const AccountSelect = ({ onChange, error, label, ...rest }: AccountSelectProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const idToAccount = (id: string) => accountMap.get(id)?.name ?? '';
  const groupByType = (id: string) => accountMap.get(id)!.type;

  return (
    <Autocomplete
      {...rest}
      disableClearable
      onChange={(e, value) => onChange(value)}
      getOptionLabel={idToAccount}
      groupBy={groupByType}
      renderInput={(params) => (
        <TextField
          label={label}
          variant={params.disabled ? 'filled' : 'outlined'}
          placeholder={error}
          error={!!error}
          {...params}
        />
      )}
    />
  );
};
