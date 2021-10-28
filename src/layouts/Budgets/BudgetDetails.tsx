import React from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { Selectors } from '../../store';
import { BudgetAccount } from '../../types';
import { getParentedName } from '../Accounts/utils';

interface BudgetDetailsProps {
  budget: BudgetAccount;
  onEdit: (budget: BudgetAccount) => void;
  onRemove: (id: string) => void;
}
export const BudgetDetails = ({ budget, onEdit, onRemove }: BudgetDetailsProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const name = getParentedName(accountMap.get(budget.account_id)!, accountMap);

  return (
    <Typography>
      Budgeted {budget.amount} for {name} in {dayjs(budget.month).format('MMMM of YYYY')}
      <Button onClick={() => onEdit(budget)}>Edit</Button>
      <Button onClick={() => onRemove(budget.id)}>Remove</Button>
    </Typography>
  );
};
