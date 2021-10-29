import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AmountSpan, makeStyledTable, StyledColumn } from '../../common';
import { Selectors } from '../../store';
import { Account, AccountType, BudgetAccount } from '../../types';
import { BudgetProgress } from './BudgetProgress';
import { fractionOfMonth } from './utils';

interface BudgetListProps {
  budgets: BudgetAccount[];
  totals: Map<string, string>;
  onEdit: (budget: BudgetAccount) => void;
  onRemove: (budget: BudgetAccount) => void;
}

export const BudgetList = ({ budgets, totals, onEdit, onRemove }: BudgetListProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const sortedBudgets = useMemo(() => sortBudgets(budgets, accountMap), [budgets, accountMap]);

  const headers = [] as StyledColumn<BudgetAccount>[];
  headers.push({ value: (b) => getBudgetName(b.account_id, accountMap) });
  headers.push({ sx: { width: 400 }, value: (b) => getBudgetProgress(b, totals, accountMap) });
  headers.push({ sx: { textAlign: 'right' }, value: (b) => getBudgetDescription(b, totals) });
  return makeStyledTable({
    items: sortedBudgets,
    headers,
    onEdit,
    onRemove,
    pagination: false,
    withHeader: false,
  });
};

function sortBudgets(budgets: BudgetAccount[], accMap: Map<string, Account>) {
  return [...budgets].sort((a, b) => getBudgetName(a.account_id, accMap).localeCompare(getBudgetName(b.account_id, accMap)));
}

function getBudgetName(accountId: string, accMap: Map<string, Account>) {
  const account = accMap.get(accountId);
  const parent = accMap.get(account!.parent_id ?? '');
  return parent ? `${parent.name}: ${account!.name}` : account!.name;
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
  const amount = totals.get(budget.account_id)?.replace('-', '') ?? '0';
  return (
    <>
      <AmountSpan noColor amount={amount} /> of <AmountSpan noColor amount={budget.amount} />
    </>
  );
}
