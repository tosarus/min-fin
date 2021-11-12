import React, { useMemo } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SxProps } from '@mui/system';
import { calculateMonthRange, formatShortMonth } from '../utils';

interface MonthSelectionProps {
  count?: number;
  value?: string;
  sx?: SxProps;
  onChange: (value: string) => void;
}

export const MonthSelection = ({ count = 12, value, onChange, sx }: MonthSelectionProps) => {
  const monthRange = useMemo(() => calculateMonthRange(count), [count]);

  return (
    <ToggleButtonGroup fullWidth exclusive color="primary" value={value} sx={sx} onChange={(e, m) => onChange(m)}>
      {monthRange.map((month, i) => (
        <ToggleButton size="small" key={i} value={month}>
          {formatShortMonth(month)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
