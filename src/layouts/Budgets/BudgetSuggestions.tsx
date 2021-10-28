import React from 'react';
import { useSelector } from 'react-redux';
import { Button, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Selectors } from '../../store';
import { Account, getBudgetAccountTypes } from '../../types';
import { getParentedName, sortAccounts } from '../Accounts/utils';
import { getCategoryAmout } from './utils';

interface BudgetSuggestionsProps {
  accounts: Account[];
  month?: string;
  onPlan: (accountId: string, amount: string) => void;
}
export const BudgetSuggestions = ({ accounts, month, onPlan }: BudgetSuggestionsProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  return (
    <StyledTable>
      <TableBody sx={{ '& td': { py: 0 } }}>
        {getBudgetAccountTypes().map((type) => (
          <>
            {sortAccounts(accounts, type, accountMap).map((acc, i) => {
              const amount = getCategoryAmout(cashFlows, acc.id, month, accountMap);
              return (
                <TableRow key={acc.id}>
                  <TableCell>
                    <Typography variant="button">{i === 0 ? type : ''}</Typography>
                  </TableCell>
                  <TableCell>{getParentedName(acc, accountMap)}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <AmountSpan amount={amount} />
                  </TableCell>
                  <TableCell sx={{ width: 50 }}>
                    <Button sx={{ py: 0 }} onClick={() => onPlan(acc.id, amount)}>
                      Plan
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </>
        ))}
      </TableBody>
    </StyledTable>
  );
};
