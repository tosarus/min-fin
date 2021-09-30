import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { Typography } from '@mui/material';
import { LoadingDots, Title, useDispatchedRender } from '../common';
import { Actions, Selectors } from '../store';

export const Overview = () => {
  const profile = useSelector(Selectors.profile);
  const selectActiveBudget = createSelector(Selectors.budgets, (budgets) =>
    budgets?.find((b) => b.id === profile?.active_budget)
  );
  const activeBudget = useDispatchedRender(selectActiveBudget, Actions.getActiveBudget, undefined, <LoadingDots />);

  return (
    <>
      <Title>Overview</Title>
      <Typography variant="body1">{`Hi, ${profile!.name}.`}</Typography>
      <Typography variant="body1">
        Active Budget:{' '}
        {activeBudget((budget) => (
          <span>{budget.name}</span>
        ))}
      </Typography>
    </>
  );
};
