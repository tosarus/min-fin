import React from 'react';
import currency from 'currency.js';
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { AmountSpan, StyledTable, Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { CsvTrans } from '../../types';

const Trans = ({ trans }: { trans: CsvTrans[] }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const onPageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <StyledTable
      pagination={{
        rowsPerPageOptions: [50, 100],
        count: trans.length,
        rowsPerPage,
        page,
        onPageChange,
        onRowsPerPageChange,
      }}>
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
        {trans.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((t, i) => (
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
};

export const DemoTransactions = () => {
  const renderTransactions = useDispatchedRender(Selectors.demoTransactions, Actions.loadDemoTransactions);

  return (
    <>
      <Title>Demo Transactions</Title>
      {renderTransactions((trans) => (
        <Trans trans={trans} />
      ))}
    </>
  );
};
