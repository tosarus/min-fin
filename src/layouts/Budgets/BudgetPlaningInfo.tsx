import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, SxProps, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { AccountType, BudgetAccount } from '../../types';
import { calculateSum, formatMonth, negateAmount } from '../utils';

interface Props {
  budgets: BudgetAccount[];
  month: string;
  sx?: SxProps;
  onAdd: () => void;
}

export const BudgetPlanningInfo = ({ budgets, month, sx, onAdd }: Props) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const income = calculateSum(
    budgets.filter((b) => accountMap.get(b.account_id)?.type === AccountType.Income).map((b) => b.amount)
  );
  const expence = calculateSum(
    budgets.filter((b) => accountMap.get(b.account_id)?.type === AccountType.Expence).map((b) => b.amount)
  );

  const balance = calculateSum([income, negateAmount(expence)]);

  return (
    <Box sx={{ ...sx, display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between' }}>
      <Typography variant="h6">
        {budgets.length > 0 ? (
          <>
            <span>Planned income </span>
            <AmountSpan amount={income} />
            <span> and spending </span>
            <AmountSpan amount={negateAmount(expence)} />
            <span> gives expected {balance.includes('-') ? 'losses' : 'profits'} of </span>
            <AmountSpan amount={balance} />
            <span> in {formatMonth(month)}</span>
          </>
        ) : (
          `Nothing planned in ${month}`
        )}
      </Typography>
      <Button onClick={onAdd}>add new category</Button>
    </Box>
  );
};
