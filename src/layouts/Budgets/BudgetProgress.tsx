import React from 'react';
import { Box, colors } from '@mui/material';
import { positiveValue } from '../utils';

interface Props {
  current: string;
  budgeted: string;
  fraction?: number;
  income?: boolean;
}

export const BudgetProgress = ({ current, budgeted, fraction = 0, income = false }: Props) => {
  const okColor = colors.green[500];
  const dangerColor = colors.red[500];
  const warningColor = colors.amber[500];
  const backgroundColor = colors.grey[300];
  const borderColor = colors.grey[600];
  const height = 15;

  const position = positiveValue(current);
  const total = positiveValue(budgeted);

  const completed = Math.max(0, Math.min(position / total, 1)) * 100;
  fraction = fraction * 100;

  let color: string;
  if (income) {
    if (fraction > 0) {
      color = completed < fraction ? warningColor : okColor;
    } else {
      color = position < total ? dangerColor : okColor;
    }
  } else {
    if (fraction > 0) {
      color = position > total ? dangerColor : completed > fraction ? warningColor : okColor;
    } else {
      color = position > total ? dangerColor : okColor;
    }
  }

  return (
    <Box
      sx={{
        height,
        width: 'calc(100% - 16px)',
        backgroundColor,
        borderRadius: height / 16,
        border: `1px solid ${borderColor}`,
        position: 'relative',
        ml: 1.25,
        mb: 0.5,
      }}>
      <Box
        sx={{
          height: '100%',
          width: `${completed}%`,
          backgroundColor: color,
          borderRadius: 'inherit',
          textAlign: 'center',
        }}
      />
      {fraction > 0 && (
        <Box
          sx={{
            position: 'absolute',
            height: height + 4,
            width: '1px',
            top: -2,
            left: `${fraction}%`,
            backgroundColor: borderColor,
          }}
        />
      )}
    </Box>
  );
};
