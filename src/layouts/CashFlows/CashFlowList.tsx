import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { Account, AccountType, CashFlow, TransactionType } from '../../types';
import { getAssetAccountTypes } from '../Accounts/utils';
import { ContractEditor, fromCashFlow } from '../Contract';
import { CashFlowTable } from './CashFlowTable';

interface CashFlowListProps {
  account: Account;
}

export const CashFlowList = ({ account }: CashFlowListProps) => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<CashFlow>>();
  const isAsset = getAssetAccountTypes().includes(account.type);

  const handleRemove = (id: string) => {
    if (workbook) {
      dispatch(Actions.removeTransaction({ workbookId: workbook.id, id }));
    }
  };

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

  return (
    <>
      <Title sx={{ display: 'flex', alignItems: 'baseline' }}>
        <span>Transactions</span>
        <Button onClick={handleAdd}>Add</Button>
      </Title>
      {editable && <ContractEditor open contract={fromCashFlow(editable)} onClose={handleClose} />}
      <Box sx={{ overflowY: 'auto' }}>
        <CashFlowTable account={account} onRemove={handleRemove} onEdit={handleEdit} />
      </Box>
    </>
  );
};
