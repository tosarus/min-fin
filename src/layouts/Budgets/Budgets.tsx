import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { BudgetAccount } from '../../types';
import { BudgetEditor } from './BudgetEditor';
import { BudgetList } from './BudgetList';
import { BudgetSuggestions } from './BudgetSuggestions';
import { MonthSelection } from './MonthSelection';
import { calculateTotals, getCurrentMonth, sameMonthFilter } from './utils';

export const Budgets = () => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const budgets = useSelector(Selectors.currentBudgets) ?? [];
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [month, setMonth] = useState(getCurrentMonth());
  const [editable, setEditable] = useState<Partial<BudgetAccount>>();

  const totals = useMemo(() => calculateTotals(cashFlows, month), [cashFlows, month]);
  const budgeted = useMemo(() => budgets.filter(sameMonthFilter(month)), [budgets, month]);
  const unbudgeted = useMemo(() => {
    const budgetedAccIds = budgeted.map((b) => b.account_id);
    return accounts.filter((acc) => !budgetedAccIds.includes(acc.id));
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

  const handleSubmit = (budget: Partial<BudgetAccount>) => {
    if (workbook) {
      dispatch(Actions.saveBudget({ workbookId: workbook.id, budget }));
    }

    setEditable(undefined);
  };

  const handleRemove = (budget: BudgetAccount) => {
    if (workbook) {
      dispatch(Actions.removeBudget({ workbookId: workbook.id, id: budget.id }));
    }
  };

  const handleMonthChange = (m: string) => setMonth(m ?? getCurrentMonth());

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexFlow: 'column', overflow: 'hidden' }}>
      <Title>{dayjs(month).format('MMMM YYYY')}</Title>
      <MonthSelection value={month} onChange={handleMonthChange} />
      {editable && <BudgetEditor open budget={editable} onClose={handleClose} onSubmit={handleSubmit} />}
      <BudgetList budgets={budgeted} totals={totals} onEdit={handleEdit} onRemove={handleRemove} />
      <Title>Unplanned</Title>
      <BudgetSuggestions accounts={unbudgeted} totals={totals} onPlan={handlePlan} />
    </Container>
  );
};
