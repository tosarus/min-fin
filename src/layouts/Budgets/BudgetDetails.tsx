import React from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Button, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { BudgetAccount } from '../../types';
import { getParentedName } from '../Accounts/utils';

interface BudgetDetailsProps {
  budget: BudgetAccount;
  amount: string;
  onEdit: (budget: BudgetAccount) => void;
  onRemove: (id: string) => void;
}
export const BudgetDetails = ({ budget, amount, onEdit, onRemove }: BudgetDetailsProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const name = getParentedName(accountMap.get(budget.account_id)!, accountMap);

  return (
    <Typography>
      {name}: <AmountSpan amount={amount} /> of <AmountSpan amount={budget.amount} />
      {dayjs(budget.month).format(' in MMMM of YYYY')}
      <Button onClick={() => onEdit(budget)}>Edit</Button>
      <Button onClick={() => onRemove(budget.id)}>Remove</Button>
    </Typography>
  );
};
