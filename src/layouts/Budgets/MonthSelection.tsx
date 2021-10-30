import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SxProps } from '@mui/system';

interface MonthSelectionProps {
  count?: number;
  value?: string;
  sx?: SxProps;
  onChange: (value: string) => void;
}

export const MonthSelection = ({ count = 12, value, onChange, sx }: MonthSelectionProps) => {
  const monthRange = useMemo(
    () =>
      [...Array(count).keys()].map((i) =>
        dayjs()
          .startOf('month')
          .subtract(count - i - 1, 'month')
          .format('YYYY-MM-DD')
      ),
    [count]
  );

  return (
    <ToggleButtonGroup fullWidth exclusive color="primary" value={value} sx={sx} onChange={(e, m) => onChange(m)}>
      {monthRange.map((month, i) => (
        <ToggleButton size="small" key={i} value={month}>
          {dayjs(month).format('MMM, YY')}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
