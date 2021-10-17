import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';
import { Title } from '../../common';
import { Actions, Selectors } from '../../store';
import { CashFlow } from '../../types';
import { Contract, ContractEditor, fromCashFlow, fromContract } from '../Contract';
import { CashFlowTable } from './CashFlowTable';

interface CashFlowListProps {
  accountId: string;
}

export const CashFlowList = ({ accountId }: CashFlowListProps) => {
  const accounts = useSelector(Selectors.currentAccounts) ?? [];
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();
  const [editable, setEditable] = useState<Partial<CashFlow>>();

  const handleSubmit = (contract: Contract) => {
    setEditable(undefined);
    if (workbook) {
      dispatch(Actions.saveTransaction({ workbookId: workbook.id, trans: fromContract(accounts, contract) }));
    }
  };

  const handleRemove = (id: string) => {
    if (workbook) {
      dispatch(Actions.removeTransaction({ workbookId: workbook.id, id }));
    }
  };

  const handleEdit = (flow: CashFlow) => {
    setEditable(flow);
  };

  const handleAdd = () => {
    setEditable({ account_id: accountId });
  };

  const handleCancel = () => {
    setEditable(undefined);
  };

  return (
    <>
      <Title sx={{ display: 'flex', alignItems: 'baseline' }}>
        <span>Transactions</span>
        <Button onClick={handleAdd}>Add</Button>
      </Title>
      {editable && <ContractEditor open contract={fromCashFlow(editable)} onCancel={handleCancel} onSubmit={handleSubmit} />}
      <Box sx={{ overflowY: 'auto' }}>
        <CashFlowTable accountId={accountId} onRemove={handleRemove} onEdit={handleEdit} />
      </Box>
    </>
  );
};
