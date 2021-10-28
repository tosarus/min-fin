import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Title } from '../../common';
import { Selectors } from '../../store';
import { BudgetAccount } from '../../types';
import { BudgetEditor } from './BudgetEditor';
import { BudgetList } from './BudgetList';
import { BudgetSuggestions } from './BudgetSuggestions';
import { MonthSelection } from './MonthSelection';
import { calculateTotals, getCurrentMonth, sameMonthFilter } from './utils';

export const Budgets = () => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const accountMap = useSelector(Selectors.currentAccountMap);
  const budgets = useSelector(Selectors.currentBudgets) ?? [];
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const [month, setMonth] = useState(getCurrentMonth());
  const [editable, setEditable] = useState<Partial<BudgetAccount>>();

  const totals = useMemo(() => calculateTotals(cashFlows, month, accountMap), [cashFlows, month, accountMap]);
  const budgeted = useMemo(() => budgets.filter(sameMonthFilter(month)), [budgets, month]);
  const unbudgeted = useMemo(() => {
    const budgetedAccIds = budgeted.map((b) => b.account_id);
    return accounts.filter(
      (acc) => !budgetedAccIds.includes(acc.id) && (!acc.parent_id || !budgetedAccIds.includes(acc.parent_id))
    );
  }, [accounts, budgeted]);

  const handlePlan = (account_id: string, amount: string) => {
    setEditable({ account_id, month, amount });
  };

  const handleEdit = (budget: BudgetAccount) => {
    setEditable(budget);
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  const handleMonthChange = (m: string) => setMonth(m ?? getCurrentMonth());

  return (
    <>
      <Title>Budgets</Title>
      <MonthSelection value={month} onChange={handleMonthChange} />
      {editable && <BudgetEditor open budget={editable} onClose={handleClose} />}
      <BudgetList budgets={budgeted} totals={totals} onEdit={handleEdit} />
      <Title>Unplanned</Title>
      <BudgetSuggestions accounts={unbudgeted} totals={totals} onPlan={handlePlan} />
    </>
  );
};
