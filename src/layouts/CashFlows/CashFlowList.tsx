import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Account, AccountType, CashFlow, getAssetAccountTypes, TransactionType } from '../../types';
import { Contract, ContractEditor, fromCashFlow, fromContract } from '../Contract';
import { CashFlowTable } from './CashFlowTable';

interface CashFlowListProps {
  account: Account;
}

export const CashFlowList = ({ account }: CashFlowListProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<CashFlow>>();
  const isAsset = getAssetAccountTypes().includes(account.type);

  const handleEdit = (flow: CashFlow) => {
    setEditable(flow);
  };

  const handleAdd = () => {
    if (isAsset) {
      setEditable({ account_id: account.id });
    } else if (account.type === AccountType.Income) {
      setEditable({ other_account_id: account.id, type: TransactionType.Income });
    } else {
      setEditable({ other_account_id: account.id, type: TransactionType.Expence });
    }
  };

  const handleClose = () => {
    setEditable(undefined);
  };

  const handleSubmit = (contract: Contract) => {
    if (workbook) {
      dispatch(Actions.saveTransaction({ workbookId: workbook.id, trans: fromContract(accounts, contract) }));
    }
    setEditable(undefined);
  };

  const handleRemove = (flow: CashFlow) => {
    if (workbook) {
      dispatch(Actions.removeTransaction({ workbookId: workbook.id, id: flow.transaction_id }));
    }
  };

  return (
    <>
      <Title sx={{ display: 'flex', alignItems: 'baseline' }}>
        <span>Transactions</span>
        <Button onClick={handleAdd}>Add</Button>
      </Title>
      {editable && <ContractEditor open contract={fromCashFlow(editable)} onClose={handleClose} onSubmit={handleSubmit} />}
      <CashFlowTable account={account} onRemove={handleRemove} onEdit={handleEdit} />
    </>
  );
};
