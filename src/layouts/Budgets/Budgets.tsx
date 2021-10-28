import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Title } from '../../common';
import { Selectors } from '../../store';
import { BudgetAccount } from '../../types';
import { BudgetEditor } from './BudgetEditor';
import { BudgetList } from './BudgetList';
import { BudgetSuggestions } from './BudgetSuggestions';
import { MonthSelection } from './MonthSelection';

export const Budgets = () => {
  const currentMonth = dayjs().startOf('month').format('YYYY-MM-DD');
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const budgets = useSelector(Selectors.currentBudgets) ?? [];
  const [month, setMonth] = useState(currentMonth);
  const [editable, setEditable] = useState<Partial<BudgetAccount>>();

  const budgeted = useMemo(
    () => budgets.filter((b) => dayjs(b.month).format('YYYY-MM-DD') === (month ?? currentMonth)),
    [budgets, month]
  );
  const unbudgeted = useMemo(() => {
    const budgetedAccIds = budgeted.map((b) => b.account_id);
    return accounts.filter(
      (acc) => !budgetedAccIds.includes(acc.id) && (!acc.parent_id || !budgetedAccIds.includes(acc.parent_id))
    );
  }, [accounts, budgeted]);

  const handlePlan = (account_id: string, amount: string) => {
    setEditable({ account_id, month: month ?? currentMonth, amount });
  };

  const handleEdit = (budget: BudgetAccount) => {
    setEditable(budget);
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  return (
    <>
      <Title>Budgets</Title>
      <MonthSelection value={month} onChange={setMonth} />
      {editable && <BudgetEditor open budget={editable} onClose={handleClose} />}
      <BudgetList budgets={budgeted} onEdit={handleEdit} />
      <Title>Unplanned</Title>
      <BudgetSuggestions accounts={unbudgeted} month={month} onPlan={handlePlan} />
    </>
  );
};
