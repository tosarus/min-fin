import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface MonthSelectionProps {
  count?: number;
  value?: string;
  onChange: (value: string) => void;
}

export const MonthSelection = ({ count = 12, value, onChange }: MonthSelectionProps) => {
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
    <ToggleButtonGroup fullWidth exclusive color="primary" sx={{ mb: 2 }} value={value} onChange={(e, m) => onChange(m)}>
      {monthRange.map((month, i) => (
        <ToggleButton size="small" key={i} value={month}>
          {dayjs(month).format('MMM, YY')}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
