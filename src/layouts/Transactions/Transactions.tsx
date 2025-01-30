import React from 'react';
import { Box } from '@mui/material';
import { TransactionList } from './TransactionList';

export const Transactions = () => (
  <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
    <Box sx={{ pl: 2, flex: '1 1 auto', display: 'flex', flexFlow: 'column' }}>
      <TransactionList />
    </Box>
  </Box>
);
