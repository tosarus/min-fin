import React from 'react';
import dateFormat from 'dateformat';
import { useSelector } from 'react-redux';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { Account, CashFlow, dateOrderCompare, TransactionType } from '../../types';

interface CashFlowTableProps {
  accountId: string;
  onRemove: (id: string) => void;
  onEdit: (tr: CashFlow) => void;
}

export const CashFlowTable = ({ accountId, onRemove, onEdit }: CashFlowTableProps) => {
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Balance</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortCashFlows(cashFlows, accountId).map((flow) => (
          <TableRow key={flow.transaction_id}>
            <TableCell>{dateFormat(flow.date, 'isoDate')}</TableCell>
            <TableCell>{buildCategory(flow, accountMap)}</TableCell>
            <TableCell>{flow.description}</TableCell>
            <TableCell>
              <AmountSpan amount={flow.amount} />
            </TableCell>
            <TableCell>
              <AmountSpan amount={flow.balance} />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', flexFlow: 'column' }}>
                <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onRemove(flow.transaction_id)}>
                  remove
                </Button>
                <Button sx={{ m: 0, p: 0 }} size="small" onClick={() => onEdit(flow)}>
                  edit
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function sortCashFlows(cashFlows: CashFlow[], accountId: string) {
  return [...cashFlows].filter((flow) => flow.account_id === accountId).sort(dateOrderCompare);
}

function buildCategory(flow: CashFlow, accMap: Map<string, Account>) {
  const { type, other_account_id, direction } = flow;
  switch (type) {
    case TransactionType.Expence:
      return accMap.get(other_account_id)?.name;
    case TransactionType.Income:
      return accMap.get(other_account_id)?.name;
    case TransactionType.Transfer:
      return `${direction} "accMap.get(other_account_id)?.name"`;
    case TransactionType.Opening:
      return 'Opening';
  }
}
