import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useRoute } from 'wouter';
import { makeStyledTable, StyledColumn } from '../../common';
import { Selectors } from '../../store';
import { Account, CashFlow, dateOrderCompare, getAssetAccountTypes } from '../../types';
import { getDisplayName, getFlowAccountFilter } from '../Accounts/utils';
import { withinMonthFilter } from '../Budgets/utils';
import { Routes } from '../listViews';

interface CashFlowTableProps {
  account: Account;
  onRemove: (flow: CashFlow) => void;
  onEdit: (flow: CashFlow) => void;
}

export const CashFlowTable = ({ account, onRemove, onEdit }: CashFlowTableProps) => {
  const [, params] = useRoute(Routes.AccountsView);
  const accountMap = useSelector(Selectors.currentAccountMap);
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const sortedCashFlows = useMemo(() => sortCashFlows(cashFlows, account, params?.month), [account, cashFlows]);
  const isAsset = getAssetAccountTypes().includes(account.type);

  const headers = [] as StyledColumn<CashFlow>[];
  headers.push({ name: 'Date', value: (flow) => dayjs(flow.date).format('MMM D'), type: 'date' });
  headers.push({ name: 'Description', value: (flow) => flow.description });
  headers.push({ name: isAsset ? 'Category' : 'Account', value: (flow) => buildCategory(flow, accountMap, isAsset) });
  headers.push({ name: 'Amount', value: (flow) => flow.amount, type: 'amount' });
  if (isAsset) {
    headers.push({ name: 'Balance', value: (flow) => flow.balance, type: 'amount' });
  }

  return makeStyledTable({
    items: sortedCashFlows,
    headers,
    detail: (flow) => flow.detail,
    onEdit,
    onRemove,
  });
};

function sortCashFlows(cashFlows: CashFlow[], account: Account, month?: string) {
  if (month) {
    cashFlows = cashFlows.filter(withinMonthFilter(month));
  }
  return cashFlows.filter(getFlowAccountFilter(account.type, [account.id])).sort(dateOrderCompare);
}

function buildCategory(flow: CashFlow, accMap: Map<string, Account>, isAsset: boolean) {
  const acc = accMap.get(isAsset ? flow.other_account_id : flow.account_id);
  return getDisplayName(acc);
}
