import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType } from '../../types';
import { calculateExpenses, calculateSum, negateAmount, sameMonthFilter } from '../utils';

export const AccountBudgetDetails = ({ account, month }: { account: Account; month?: string }) => {
  const budgets = useSelector(Selectors.currentBudgets) ?? [];
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const totalExpenses = useMemo(() => calculateExpenses(cashFlows, account, month), [account, cashFlows, month]);
  const plannedExpenses = useMemo(
    () =>
      calculateSum(
        budgets
          .filter(sameMonthFilter(month))
          .filter((b) => b.account_id === account.id)
          .map((b) => b.amount)
      ),
    [account, budgets, month]
  );
  const isIncome = account.type === AccountType.Income;

  const lineSx = { display: 'flex', pl: 2 };

  return month ? (
    <>
      <Box sx={lineSx}>
        <Typography sx={{ mr: 2, width: 120 }}>Total</Typography>
        <AmountSpan amount={totalExpenses} />
      </Box>
      <Box sx={lineSx}>
        <Typography sx={{ mr: 2, width: 120 }}>Planned</Typography>
        <AmountSpan amount={isIncome ? plannedExpenses : negateAmount(plannedExpenses)} />
      </Box>
    </>
  ) : (
    <Box sx={lineSx}>
      <Typography sx={{ mr: 2, width: 120 }}>This year</Typography>
      <AmountSpan amount={totalExpenses} />
    </Box>
  );
};
