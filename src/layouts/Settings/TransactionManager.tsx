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

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', alignItems: 'flex-start', px: 2 }}>
      <Typography>Active Workbook: {workbook?.name ?? 'none'}</Typography>
      <Button sx={{ px: 0 }} onClick={handleUpdateCashFlows}>
        Update Cash Flows
      </Button>
    </Box>
  );
};