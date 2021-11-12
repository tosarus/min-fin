import React from 'react';
import { makeStyledTable, Title, StyledColumn, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { CsvTrans } from '../../types';
import { negateAmount, positiveAmount } from '../utils';

const Trans = ({ trans }: { trans: CsvTrans[] }) => {
  const headers = [] as StyledColumn<CsvTrans>[];
  headers.push({ name: 'Date', value: (t) => t.date, type: 'date' });
  headers.push({ name: 'Description', value: (t) => t.descr });
  headers.push({ name: 'Category', value: (t) => t.category });
  headers.push({ name: 'Account', value: (t) => t.account });
  headers.push({
    name: 'Amount',
    value: (t) => (t.type === 'credit' ? positiveAmount(t.amount) : negateAmount(t.amount)),
    type: 'amount',
  });

  return makeStyledTable({ items: trans, headers });
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
