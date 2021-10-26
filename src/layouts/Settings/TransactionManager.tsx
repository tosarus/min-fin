import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { Actions, Selectors } from '../../store';

export const TransactionManager = () => {
  const workbook = useSelector(Selectors.activeWorkbook);
  const dispatch = useDispatch();

  const handleUpdateCashFlows = () => {
    if (workbook) {
      dispatch(Actions.updateCashFlows(workbook.id));
    }
  };

  const handleImport = (files: FileList | null) => {
    if (workbook && files?.length) {
      dispatch(Actions.importTransactions({ workbookId: workbook.id, file: files[0] }));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-start', px: 2 }}>
      <Typography>Active Workbook: {workbook?.name ?? 'none'}</Typography>
      <Button sx={{ px: 0, mb: 2 }} onClick={handleUpdateCashFlows}>
        Update Cash Flows
      </Button>
      <Button sx={{ px: 0, mb: 2 }} component="label">
        Import Transactions
        <input
          onChange={(e) => {
            e.preventDefault();
            handleImport(e.target.files);
            e.target.value = '';
          }}
          type="file"
          hidden
        />
      </Button>
    </Box>
  );
};
