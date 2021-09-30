import React from 'react';
import * as colors from '@mui/material/colors';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { CsvTrans } from '../../types';

const Trans = ({ trans }: { trans: CsvTrans[] }) => (
  <Table>
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
          <TableCell align="right" sx={{ color: t.type === 'credit' ? colors.green[500] : colors.red[500] }}>
            ${t.amount}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Transactions = () => {
  const renderTransactions = useDispatchedRender(Selectors.transactions, Actions.loadTransactions);

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
