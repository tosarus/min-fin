import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { AccountType, BudgetAccount } from '../../types';
import { BudgetEditor } from './BudgetEditor';
import { BudgetGroup } from './BudgetGroup';
import { BudgetPlanningInfo } from './BudgetPlaningInfo';
import { MonthSelection } from './MonthSelection';
import { getCurrentMonth, sameMonthFilter, withinMonthFilter } from './utils';

export const Budgets = () => {
  // const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const budgets = useSelector(Selectors.currentBudgets) ?? [];
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [month, setMonth] = useState(getCurrentMonth());
  const [editable, setEditable] = useState<Partial<BudgetAccount>>();

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

  const handleRemove = (budget: BudgetAccount) => {
    if (workbook) {
      dispatch(Actions.removeBudget({ workbookId: workbook.id, id: budget.id }));
    }
  };

  const handleCopy = (type: AccountType) => {
    if (workbook) {
      dispatch(Actions.copyFromPrevious({ workbookId: workbook.id, type, month }));
    }
  };

  const handleMonthChange = (m: string) => setMonth(m ?? getCurrentMonth());

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', overflow: 'auto', pr: 3 }}>
      <Title sx={{ pl: '20%' }}>Budgets</Title>
      <MonthSelection sx={{ pl: '20%', mb: 3 }} value={month} onChange={handleMonthChange} />
      {editable && <BudgetEditor open budget={editable} onClose={handleClose} onSubmit={handleSubmit} />}
      <BudgetPlanningInfo budgets={monthBudgets} month={dayjs(month).format('MMMM, YYYY')} onAdd={handleAdd} />
      <BudgetGroup
        budgets={monthBudgets}
        cashFlows={monthFlows}
        type={AccountType.Income}
        month={month}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onPlan={handlePlan}
        onCopy={handleCopy}
      />
      <BudgetGroup
        budgets={monthBudgets}
        cashFlows={monthFlows}
        type={AccountType.Expence}
        month={month}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onPlan={handlePlan}
        onCopy={handleCopy}
      />
    </Box>
  );
};
