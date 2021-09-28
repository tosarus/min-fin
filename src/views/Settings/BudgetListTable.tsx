import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@material-ui/core';
import { EditableString } from '../../common/EditableString';
import { Budget } from '../../types';
import { Actions, Selectors } from '../../store';

interface BudgetListTableProps {
  budgets: Budget[];
}

export const BudgetListTable = ({ budgets }: BudgetListTableProps) => {
  const profile = useSelector(Selectors.profile);
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);

  const handleAddNew = () => {
    if (!adding) {
      setAdding(true);
    }
  };

  const handleCancelNew = () => {
    setAdding(false);
  };

  const handleNewBugget = (name: string) => {
    setAdding(false);
    dispatch(Actions.createBudget({ name }));
  };

  const handleUpdate = (budget: Budget, name: string) => {
    dispatch(Actions.updateBudget({ id: budget.id, name }));
  };

  const handleActive = (budget: Budget) => {
    if (budget.id !== profile!.active_budget) {
      dispatch(Actions.updateProfile({ active_budget: budget.id }));
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget.id}>
            <TableCell>
              <EditableString value={budget.name} name="Name" onChanged={(name) => handleUpdate(budget, name)} />
            </TableCell>
            <TableCell onClick={() => handleActive(budget)}>
              {budget.id === profile?.active_budget ? 'Yes' : 'No'}
            </TableCell>
          </TableRow>
        ))}
        {adding && (
          <TableRow>
            <TableCell>
              <EditableString
                value=""
                name="New Budget Name"
                editing
                onChanged={handleNewBugget}
                onCancel={handleCancelNew}
              />
            </TableCell>
            <TableCell />
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell color="primary" onClick={handleAddNew}>
            Add new
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
};
