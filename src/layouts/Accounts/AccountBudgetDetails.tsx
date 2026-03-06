import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType } from '../../types';
import { calculateExpenses, calculateSum, calculateTaggedExpenses, negateAmount, sameMonthFilter } from '../utils';

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
  const totalTagged = useMemo(() => calculateTaggedExpenses(cashFlows, account, month), [account, cashFlows, month]);
  const isIncome = account.type === AccountType.Income;

  const lineSx = { display: 'flex', pl: 2 };

  const ReportLine = ({ label, amount }: { label: string; amount: string }) => (
    <Box sx={lineSx}>
      <Typography sx={{ mr: 2, width: 120 }}>{label}</Typography>
      <AmountSpan amount={amount} />
    </Box>
  );

  return month ? (
    <>
      <ReportLine label="Total" amount={totalExpenses} />
      <ReportLine label="Planned" amount={isIncome ? plannedExpenses : negateAmount(plannedExpenses)} />
      {totalTagged.size > 0 && <Divider sx={{ my: 1 }} />}
      {totalTagged.entries().map((entry) => (
        <ReportLine key={entry[0]} label={entry[0]} amount={entry[1]} />
      ))}
    </>
  ) : (
    <Box sx={lineSx}>
      <Typography sx={{ mr: 2, width: 120 }}>This year</Typography>
      <AmountSpan amount={totalExpenses} />
    </Box>
  );
};
