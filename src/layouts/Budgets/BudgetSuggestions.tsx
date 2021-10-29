import React, { useMemo } from 'react';
import { Button, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { AmountSpan, StyledTable } from '../../common';
import { Account, getBudgetAccountTypes } from '../../types';
import { sortAccounts } from '../Accounts/utils';

interface BudgetSuggestionsProps {
  accounts: Account[];
  totals: Map<string, string>;
  onPlan: (accountId: string, amount: string) => void;
}

export const BudgetSuggestions = ({ accounts, totals, onPlan }: BudgetSuggestionsProps) => {
  const accountsWithTotals = useMemo(() => accounts.filter((acc) => totals.has(acc.id)), [accounts, totals]);

  return (
    <StyledTable>
      <TableBody sx={{ '& td': { py: 0 } }}>
        {getBudgetAccountTypes().map((type) => (
          <>
            {sortAccounts(accountsWithTotals, type).map((acc, i) => (
              <TableRow key={acc.id}>
                <TableCell>
                  <Typography variant="button">{i === 0 ? type : ''}</Typography>
                </TableCell>
                <TableCell>{acc.name}</TableCell>
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
