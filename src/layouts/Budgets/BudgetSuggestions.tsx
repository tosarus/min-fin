import React from 'react';
import { useSelector } from 'react-redux';
import { Button, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Selectors } from '../../store';
import { Account, getBudgetAccountTypes } from '../../types';
import { getParentedName, sortAccounts } from '../Accounts/utils';

interface BudgetSuggestionsProps {
  accounts: Account[];
  totals: Map<string, string>;
  onPlan: (accountId: string, amount: string) => void;
}

export const BudgetSuggestions = ({ accounts, totals, onPlan }: BudgetSuggestionsProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);

  return (
    <StyledTable>
      <TableBody sx={{ '& td': { py: 0 } }}>
        {getBudgetAccountTypes().map((type) => (
          <>
            {sortAccounts(
              accounts.filter((acc) => totals.has(acc.id)),
              type,
              accountMap
            ).map((acc, i) => (
              <TableRow key={acc.id}>
                <TableCell>
                  <Typography variant="button">{i === 0 ? type : ''}</Typography>
                </TableCell>
                <TableCell>{getParentedName(acc, accountMap)}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <AmountSpan amount={totals.get(acc.id)!} />
                </TableCell>
                <TableCell sx={{ width: 50 }}>
                  <Button sx={{ py: 0 }} onClick={() => onPlan(acc.id, totals.get(acc.id)!)}>
                    Plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </>
        ))}
      </TableBody>
    </StyledTable>
  );
};
