import React from 'react';
import currency from 'currency.js';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan, StyledTable, Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { CsvTrans } from '../../types';

const Trans = ({ trans }: { trans: CsvTrans[] }) => (
  <StyledTable>
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Account</TableCell>
        <TableCell>Amount</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {trans.slice(0, 50).map((t, i) => (
        <TableRow key={i}>
          <TableCell>{t.date}</TableCell>
          <TableCell>{t.descr}</TableCell>
          <TableCell>{t.category}</TableCell>
          <TableCell>{t.account}</TableCell>
          <TableCell align="right">
            <AmountSpan
              amount={currency(t.amount)
                .multiply(t.type === 'credit' ? 1 : -1)
                .format()}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </StyledTable>
);

export const DemoTransactions = () => {
  const renderTransactions = useDispatchedRender(Selectors.demoTransactions, Actions.loadDemoTransactions);

  return (
    <>
      <Title>Transactions</Title>
      <div style={{ overflowY: 'auto' }}>
        {renderTransactions((trans) => (
          <Trans trans={trans} />
        ))}
      </div>
    </>
  );
};
