import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { AmountSpan } from '../../common';
import { Selectors } from '../../store';
import { Account } from '../../types';
import { calculatePending, subtractAmount } from '../utils';

export const AccountAssetDetails = ({ account }: { account: Account }) => {
  const cashFlows = useSelector(Selectors.currentCashFlows) ?? [];
  const pendingBalance = useMemo(() => calculatePending(cashFlows, account), [account, cashFlows]);

  const lineSx = { display: 'flex', pl: 2 };

  return (
    <>
      <Box sx={lineSx}>
        <Typography sx={{ mr: 2, width: 120 }}>Balance</Typography>
        <AmountSpan amount={account.balance} />
      </Box>
      <Box sx={lineSx}>
        <Typography sx={{ mr: 2, width: 120 }}>Posted</Typography>
        <AmountSpan amount={subtractAmount(account.balance, pendingBalance)} />
      </Box>
      <Box sx={lineSx}>
        <Typography sx={{ mr: 2, width: 120 }}>Pending</Typography>
        <AmountSpan amount={pendingBalance} />
      </Box>
    </>
  );
};
