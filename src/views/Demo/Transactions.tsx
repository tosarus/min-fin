import React from 'react';
import { colors, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { CsvTrans } from '../../types';

const useStyles = makeStyles(() => ({
  debit: {
    color: colors.red[500],
  },
  credit: {
    color: colors.green[500],
  },
}));

const Trans = ({ trans }: { trans: CsvTrans[] }) => {
  const classes = useStyles();

  return (
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
        {trans.slice(0, 15).map((t, i) => (
          <TableRow key={i}>
            <TableCell>{t.date}</TableCell>
            <TableCell>{t.descr}</TableCell>
            <TableCell>{t.category}</TableCell>
            <TableCell>{t.account}</TableCell>
            <TableCell align="right" className={classes[t.type]}>
              ${t.amount}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const Transactions = () => {
  const renderTransactions = useDispatchedRender(Selectors.transactions, Actions.loadTransactions);

  return (
    <>
      <Title>Transactions</Title>
      {renderTransactions((trans) => (
        <Trans trans={trans} />
      ))}
    </>
  );
};
