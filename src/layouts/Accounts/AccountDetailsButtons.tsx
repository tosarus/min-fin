import React from 'react';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Button, Typography } from '@mui/material';
import { Account } from '@shared/types';
import { FlexLink } from '../../common';
import { Links } from '../listViews';
import { formatShortMonth, getNextMonth, getPreviousMonth } from '../utils';

interface AccountDetailsButtonsProps {
  account: Account;
  month?: string;
  onEdit: (account: Account) => void;
}

export const AccountDetailsButtons = ({ account, month, onEdit }: AccountDetailsButtonsProps) => {
  if (!month) {
    const handleEdit = () => onEdit(account);
    return (
      <Button sx={{ py: 0 }} onClick={handleEdit}>
        Edit
      </Button>
    );
  }

  const prevMonth = getPreviousMonth(month);
  const nextMonth = getNextMonth(month);

  return (
    <>
      <FlexLink href={Links.accountsViewMonth(account.id, prevMonth)} sx={{ px: 1, ml: 1 }}>
        <KeyboardDoubleArrowLeftIcon />
        <Typography>{formatShortMonth(prevMonth)}</Typography>
      </FlexLink>
      {nextMonth ? (
        <FlexLink href={Links.accountsViewMonth(account.id, nextMonth)} sx={{ px: 1 }}>
          <Typography>{formatShortMonth(nextMonth)}</Typography>
          <KeyboardDoubleArrowRightIcon />
        </FlexLink>
      ) : (
        <Typography sx={{ px: 1, height: 24 }}>
          <KeyboardDoubleArrowRightIcon color="disabled" />
        </Typography>
      )}
    </>
  );
};
