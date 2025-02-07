import React, { useMemo, useState } from 'react';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { SxProps } from '@mui/system';
import { calculateMonthRange, formatShortMonth, getCurrentMonth, getNextMonth, getPreviousMonth } from '../utils';

interface MonthSelectionProps {
  count?: number;
  value?: string;
  sx?: SxProps;
  onChange: (value: string) => void;
}

export const MonthSelection = ({ count = 12, value, onChange, sx }: MonthSelectionProps) => {
  const [month, setMonth] = useState(getCurrentMonth());
  const monthRange = useMemo(() => calculateMonthRange(count, month), [count, month]);

  const prevMonth = getPreviousMonth(monthRange[0]);
  const nextMonth = getNextMonth(month);

  return (
    <ToggleButtonGroup fullWidth exclusive color="primary" value={value} sx={sx} onChange={(e, m) => onChange(m)}>
      <ToggleButton size="small" value={prevMonth} sx={{ width: 30 }} onClick={() => setMonth(getPreviousMonth(month))}>
        <KeyboardDoubleArrowLeftIcon />
      </ToggleButton>
      {monthRange.map((month, i) => (
        <ToggleButton size="small" key={i} value={month}>
          {formatShortMonth(month)}
        </ToggleButton>
      ))}
      {nextMonth && (
        <ToggleButton size="small" value={nextMonth} sx={{ width: 30 }} onClick={() => setMonth(nextMonth)}>
          <KeyboardDoubleArrowRightIcon />
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};
