import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Selectors } from '../../store';
import { AccountType, BudgetAccount, CashFlow, TransactionType } from '../../types';
import { calculateTotals } from '../utils';
import { BudgetList } from './BudgetList';
import { BudgetSuggestions } from './BudgetSuggestions';
import { BudgetSummary } from './BudgetSummary';

interface BudgetGroupProps {
  budgets: BudgetAccount[];
  cashFlows: CashFlow[];
  type: AccountType;
  month: string;
  onEdit: (budget: BudgetAccount) => void;
  onRemove: (budget: BudgetAccount) => void;
  onPlan: (accountId: string, amount: string) => void;
  onCopy: (type: AccountType) => void;
}

export const BudgetGroup = ({ budgets, cashFlows, type, month, onEdit, onRemove, onPlan, onCopy }: BudgetGroupProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const planned = budgets.filter((b) => accountMap.get(b.account_id)?.type === type);
  const totals = useMemo(() => {
    const transType = type === AccountType.Income ? TransactionType.Income : TransactionType.Expence;
    return calculateTotals(cashFlows, transType);
  }, [cashFlows, type]);

  const plannedIds = new Set(planned.map((b) => b.account_id));
  const unplanned = [...totals.keys()].filter((id) => !plannedIds.has(id)).map((id) => accountMap.get(id)!);

  return (
    <Box sx={{ display: 'flex', flexFlow: 'row', mb: 3 }}>
      <BudgetSummary sx={{ flex: '1 0 20%', textAlign: 'right', pr: 3 }} type={type} budgets={planned} totals={totals} />
      <Box sx={{ flex: '1 0 80%' }}>
        <BudgetList budgets={planned} month={month} totals={totals} onEdit={onEdit} onRemove={onRemove} />
        {planned.length === 0 && <Button onClick={() => onCopy(type)}>Copy budgets from previous month?</Button>}
        {unplanned.length > 0 && (
          <BudgetSuggestions accounts={unplanned} month={month} totals={totals} type={type} onPlan={onPlan} />
        )}
      </Box>
    </Box>
  );
};
