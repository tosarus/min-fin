import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton, styled, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { AmountSpan, RoundedLink, StyledTable } from '../../common';
import { Account, AccountType } from '../../types';
import { Links } from '../listViews';
import { sortAccounts } from '../utils';

interface BudgetSuggestionsProps {
  accounts: Account[];
  type: AccountType;
  totals: Map<string, string>;
  month: string;
  onPlan: (accountId: string, amount: string) => void;
}

const FitRoundedLink = styled(RoundedLink)({
  marginBottom: 2,
});

export const BudgetSuggestions = ({ accounts, totals, type, month, onPlan }: BudgetSuggestionsProps) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <Typography
        sx={{ pl: 2, mt: 2, mb: 1, cursor: 'pointer' }}
        component="h6"
        variant="body1"
        color="primary"
        onClick={toggleOpen}>
        {open ? 'hide unplanned' : 'show unplanned'}
      </Typography>
      {open && (
        <StyledTable sx={{ '& td': { px: 1, py: 0 } }}>
          <TableBody>
            {sortAccounts(accounts, type).map((acc) => (
              <TableRow key={acc.id}>
                <TableCell>
                  <FitRoundedLink href={Links.accountsViewMonth(acc.id, month)}>
                    <span>{acc.name}</span>
                    <AmountSpan amount={totals.get(acc.id)!} />
                  </FitRoundedLink>
                </TableCell>
                <TableCell sx={{ width: 30 }}>
                  <IconButton size="small" sx={{ py: 0, m: 0 }} onClick={() => onPlan(acc.id, totals.get(acc.id)!)}>
                    <AddCircleOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      )}
    </>
  );
};
