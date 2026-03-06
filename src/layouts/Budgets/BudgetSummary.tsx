import React from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { AccountType, BudgetAccount } from '../../types';
import { calculateSum } from '../utils';

interface BudgetSummaryProps {
  type: AccountType;
  totals: Map<string, string>;
  tagged: Map<string, string>;
  budgets: BudgetAccount[];
}

export const BudgetSummary = ({ type, totals, tagged, budgets, ...props }: BudgetSummaryProps & BoxProps) => {
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
        <Typography sx={{ mb: 1 }}>
          <Typography component="span">Unplanned: </Typography>
          <AmountSpan amount={extra} />
        </Typography>
      )}
      {Array.from(tagged.entries()).map((entry) => (
        <Typography key={entry[0]}>
          <Typography component="span">{entry[0]}: </Typography>
          <AmountSpan noColor amount={entry[1]} />
        </Typography>
      ))}
    </Box>
  );
};
