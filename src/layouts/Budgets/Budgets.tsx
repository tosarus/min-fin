import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useRoute } from 'wouter';
import { Box } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { AccountType, BudgetAccount } from '../../types';
import { Links, Routes } from '../listViews';
import { getCurrentMonth, sameMonthFilter, withinMonthFilter } from '../utils';
import { BudgetEditor } from './BudgetEditor';
import { BudgetGroup } from './BudgetGroup';
import { BudgetPlanningInfo } from './BudgetPlaningInfo';
import { MonthSelection } from './MonthSelection';

export const Budgets = () => {
  const budgets = useSelector(Selectors.currentBudgets) ?? [];
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<BudgetAccount>>();
  const [, params] = useRoute(Routes.Budgets);
  const [, setLocation] = useLocation();
  const month = params?.month ?? getCurrentMonth();

  const monthBudgets = useMemo(() => budgets.filter(sameMonthFilter(month)), [budgets, month]);
  const monthFlows = useMemo(() => cashFlows.filter(withinMonthFilter(month)), [cashFlows, month]);

  const handleAdd = () => {
    setEditable({ month });
  };

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

  const handleRemove = (budgetId?: string) => {
    if (workbook && budgetId) {
      dispatch(Actions.removeBudget({ workbookId: workbook.id, id: budgetId }));
    }
  };

  const handleCopy = (type: AccountType) => {
    if (workbook) {
      dispatch(Actions.copyFromPrevious({ workbookId: workbook.id, type, month }));
    }
  };

  const handleMonthChange = (m: string) => {
    const currentMonth = getCurrentMonth();
    if ((m ?? currentMonth) === currentMonth) {
      setLocation(Links.budgets());
    } else {
      setLocation(Links.budgetsForMonth(m));
    }
  };

  const leftWidth = '20%';

  const rightBlock = {
    pl: `calc(${leftWidth} + 16px)`,
    pr: '16px',
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', overflow: 'hidden', pr: 3 }}>
      <Title sx={rightBlock}>Budgets</Title>
      <MonthSelection sx={{ ...rightBlock, mb: 3 }} value={month} onChange={handleMonthChange} />
      {editable && (
        <BudgetEditor
          budget={editable}
          planned={monthBudgets}
          onClose={handleClose}
          onSubmit={handleSubmit}
          onRemove={handleRemove}
        />
      )}
      <BudgetPlanningInfo sx={{ ...rightBlock, mb: 1 }} budgets={monthBudgets} month={month} onAdd={handleAdd} />
      <Box sx={{ display: 'flex', flexFlow: 'column', overflow: 'auto' }}>
        <BudgetGroup
          budgets={monthBudgets}
          cashFlows={monthFlows}
          type={AccountType.Income}
          month={month}
          width={leftWidth}
          onEdit={handleEdit}
          onPlan={handlePlan}
          onCopy={handleCopy}
        />
        <BudgetGroup
          budgets={monthBudgets}
          cashFlows={monthFlows}
          type={AccountType.Expence}
          month={month}
          width={leftWidth}
          onEdit={handleEdit}
          onPlan={handlePlan}
          onCopy={handleCopy}
        />
      </Box>
    </Box>
  );
};
