import React from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { AccountType, BudgetAccount } from '../../types';
import { calculateSum } from '../utils';

interface BudgetSummaryProps {
  type: AccountType;
  totals: Map<string, string>;
  budgets: BudgetAccount[];
}

export const BudgetSummary = ({ type, totals, budgets, ...props }: BudgetSummaryProps & BoxProps) => {
  const planned = calculateSum(budgets.map((b) => b.amount));
  const plannedIds = new Set(budgets.map((b) => b.account_id));
  const actual = calculateSum([...totals.entries()].filter((entry) => plannedIds.has(entry[0])).map((entry) => entry[1]));
  const extraTotals = [...totals.entries()].filter((entry) => !plannedIds.has(entry[0]));
  const extra = calculateSum(extraTotals.map((entry) => entry[1]));

  return (
    <Box {...props}>
      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
        {type === AccountType.Income ? 'Income' : 'Spending'}
      </Typography>
      <Typography sx={{ mb: 1 }}>
        <AmountSpan noColor amount={actual} />
        <Typography component="span"> of </Typography>
        <AmountSpan noColor amount={planned} />
      </Typography>
      {extraTotals.length > 0 && (
        <Typography>
          <Typography component="span">Unplaned </Typography>
          <AmountSpan amount={extra} />
        </Typography>
      )}
    </Box>
  );
};
