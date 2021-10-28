import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions, Selectors } from '../../store';
import { Account, BudgetAccount } from '../../types';
import { BudgetDetails } from './BudgetDetails';

interface BudgetListProps {
  budgets: BudgetAccount[];
  onEdit: (budget: BudgetAccount) => void;
}
export const BudgetList = ({ budgets, onEdit }: BudgetListProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const handleRemove = (id: string) => {
    if (workbook) {
      dispatch(Actions.removeBudget({ workbookId: workbook.id, id }));
    }
  };

  return (
    <>
      {sortBudgets(budgets, accountMap).map((budget) => (
        <BudgetDetails key={budget.id} budget={budget} onEdit={onEdit} onRemove={handleRemove} />
      ))}
    </>
  );
};

function getParentedName(accountId: string, accMap: Map<string, Account>) {
  const account = accMap.get(accountId);
  const parent = accMap.get(account!.parent_id ?? '');
  return parent ? `${parent.name}: ${account!.name}` : account!.name;
}

function sortBudgets(budgets: BudgetAccount[], accMap: Map<string, Account>) {
  return [...budgets].sort((a, b) =>
    getParentedName(a.account_id, accMap).localeCompare(getParentedName(b.account_id, accMap))
  );
}
