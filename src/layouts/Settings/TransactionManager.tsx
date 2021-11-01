import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { DownloadButton, OpenFileButton } from '../../common';
import { Actions, Selectors } from '../../store';
import { ImportTransaction } from '../../types';

export const TransactionManager = () => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();

  const handleUpdateCashFlows = () => {
    if (workbook) {
      dispatch(Actions.updateCashFlows(workbook.id));
    }
  };

  const handleCsv = (file: File) => {
    if (workbook) {
      dispatch(Actions.importTransactionsCsv({ workbookId: workbook.id, file }));
    }
  };

  const handleJson = (result?: string) => {
    if (workbook && result) {
      const raw = JSON.parse(result) as ImportTransaction[];
      dispatch(Actions.importTransactions({ workbookId: workbook.id, raw }));
    }
  };

  const handleExport = () => {
    if (workbook) {
      dispatch(Actions.exportTransactions(workbook.id));
    }
  };

  const sxProps = { px: 0, mb: 2 };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-start', px: 2 }}>
      <Typography sx={sxProps}>Active Workbook: {workbook?.name ?? 'none'}</Typography>
      <Button sx={sxProps} onClick={handleUpdateCashFlows}>
        Update Cash Flows
      </Button>
      <OpenFileButton sx={sxProps} accept=".csv" onFile={handleCsv}>
        Import Transactions from Mint CSV
      </OpenFileButton>
      <OpenFileButton sx={sxProps} accept=".json" onText={handleJson}>
        Import Transactions
      </OpenFileButton>
      <DownloadButton
        sx={sxProps}
        onClick={handleExport}
        target={Selectors.exportedTransactions}
        filename="transactions.json">
        Export Transactions
      </DownloadButton>
    </Box>
  );
};
