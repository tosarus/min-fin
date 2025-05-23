import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRoute } from 'wouter';
import { makeStyledTable, renderDetails, StyledColumn } from '../../common';
import { Selectors } from '../../store';
import { Account, CashFlow, dateOrderPendingCompare, getAssetAccountTypes } from '../../types';
import { Routes } from '../listViews';
import { formatShortDate, getDisplayName, getFlowAccountFilter, withinMonthFilter } from '../utils';

interface CashFlowTableProps {
  account: Account;
  onEdit: (flow: CashFlow) => void;
}

export const CashFlowTable = ({ account, onEdit }: CashFlowTableProps) => {
  const [, params] = useRoute(Routes.AccountsView);
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const sortedCashFlows = useMemo(() => sortCashFlows(cashFlows, account, params?.month), [account, cashFlows, params]);
  const isAsset = getAssetAccountTypes().includes(account.type);

  const headers = [] as StyledColumn<CashFlow>[];
  headers.push({ name: 'Date', value: (flow) => formatShortDate(flow.date), type: 'date' });
  headers.push({ name: 'Description', value: (flow) => flow.description });
  headers.push({ name: isAsset ? 'Category' : 'Account', value: (flow) => buildCategory(flow, accountMap, isAsset) });
  headers.push({ name: 'Amount', value: (flow) => flow.amount, type: 'amount' });
  if (isAsset) {
    headers.push({ name: 'Balance', value: (flow) => flow.balance, type: 'amount' });
  }

  return makeStyledTable({
    items: sortedCashFlows,
    headers,
    detail: (flow) => renderDetails(flow.detail),
    accent: (flow) => flow.pending,
    accentSx: { fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.03)' },
    onEdit,
  });
};

function sortCashFlows(cashFlows: CashFlow[], account: Account, month?: string) {
  if (month) {
    cashFlows = cashFlows.filter(withinMonthFilter(month));
  }
  return cashFlows.filter(getFlowAccountFilter(account.type, account.id)).sort(dateOrderPendingCompare);
}

function buildCategory(flow: CashFlow, accMap: Map<string, Account>, isAsset: boolean) {
  const acc = accMap.get(isAsset ? flow.other_account_id : flow.account_id);
  return getDisplayName(acc);
}
