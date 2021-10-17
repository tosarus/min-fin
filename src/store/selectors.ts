import { createSelector } from '@reduxjs/toolkit';
import { Selectors as selectors } from './slices';

const activeWorkbook = createSelector(selectors.workbooks, selectors.profile, (workbooks, profile) =>
  workbooks?.find((wb) => wb.id === profile?.active_workbook)
);

const currentAccounts = createSelector(activeWorkbook, selectors.accounts, (activeWb, accounts) =>
  accounts?.filter((acc) => acc.workbook_id === activeWb?.id)
);

const currentAccountMap = createSelector(currentAccounts, (accounts) => new Map(accounts?.map((acc) => [acc.id, acc])));

const currentCashFlows = createSelector(activeWorkbook, selectors.cashFlows, (activeWb, cashFlows) =>
  cashFlows?.filter((flow) => flow.workbook_id === activeWb?.id)
);

const currentTransactions = createSelector(activeWorkbook, selectors.transactions, (activeWb, transactions) =>
  transactions?.filter((tr) => tr.workbook_id === activeWb?.id)
);

export const Selectors = {
  ...selectors,
  activeWorkbook,
  currentAccounts,
  currentAccountMap,
  currentCashFlows,
  currentTransactions,
};
