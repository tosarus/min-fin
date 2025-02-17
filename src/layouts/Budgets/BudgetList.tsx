import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';
import { AmountSpan, makeStyledTable, RoundedLink, StyledColumn } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType, BudgetAccount } from '../../types';
import { Links } from '../listViews';
import { fractionOfMonth, positiveAmount } from '../utils';
import { BudgetProgress } from './BudgetProgress';

interface BudgetListProps {
  budgets: BudgetAccount[];
  totals: Map<string, string>;
  month: string;
  onEdit: (budget: BudgetAccount) => void;
}

const FitRoundedLink = styled(RoundedLink)({
  marginBottom: 2,
});

export const BudgetList = ({ budgets, totals, month, onEdit }: BudgetListProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const sortedBudgets = useMemo(() => sortBudgets(budgets, accountMap), [budgets, accountMap]);

  const headers = [] as StyledColumn<BudgetAccount>[];
  headers.push({ value: (b) => getBudgetNameLink(b, accountMap, month) });
  headers.push({ sx: { textAlign: 'right' }, value: (b) => getBudgetDescription(b, totals) });
  return makeStyledTable({
    items: sortedBudgets,
    headers,
    detail: (b) => getBudgetProgress(b, totals, accountMap),
    onEdit,
    sx: { '& td': { px: 1, py: 0.25, borderBottomColor: 'white' } },
    pagination: false,
    withHeader: false,
  });
};

function sortBudgets(budgets: BudgetAccount[], accMap: Map<string, Account>) {
  return [...budgets].sort((a, b) => getBudgetName(a, accMap).localeCompare(getBudgetName(b, accMap)));
}

function getBudgetName(budget: BudgetAccount, accMap: Map<string, Account>) {
  return accMap.get(budget.account_id)?.name ?? '';
}

function getBudgetNameLink(budget: BudgetAccount, accMap: Map<string, Account>, month: string) {
  return (
    <FitRoundedLink href={Links.accountsViewMonth(budget.account_id, month)}>
      <span>{getBudgetName(budget, accMap)}</span>
      <></>
    </FitRoundedLink>
  );
}

function getBudgetProgress(budget: BudgetAccount, totals: Map<string, string>, accMap: Map<string, Account>) {
  return (
    <BudgetProgress
      current={totals.get(budget.account_id) ?? '0'}
      budgeted={budget.amount}
      income={accMap.get(budget.account_id)?.type === AccountType.Income}
      fraction={fractionOfMonth(budget.month)}
    />
  );
}

function getBudgetDescription(budget: BudgetAccount, totals: Map<string, string>) {
  const amount = positiveAmount(totals.get(budget.account_id) ?? '0');
  return (
    <>
      <AmountSpan noColor amount={amount} /> of <AmountSpan noColor amount={budget.amount} />
    </>
  );
}
