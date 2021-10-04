import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { Typography } from '@mui/material';
import { LoadingDots, Title, useDispatchedRender } from '../common';
import { Actions, Selectors } from '../store';

export const Overview = () => {
  const profile = useSelector(Selectors.profile);
  const selectActiveWorkbook = createSelector(Selectors.workbooks, (workbooks) =>
    workbooks?.find((b) => b.id === profile?.active_workbook)
  );
  const activeWorkbook = useDispatchedRender(selectActiveWorkbook, Actions.getActiveWorkbook, undefined, <LoadingDots />);

  return (
    <>
      <Title>Overview</Title>
      <Typography variant="body1">{`Hi, ${profile!.name}.`}</Typography>
      <Typography variant="body1">
        Active Workbook:{' '}
        {profile?.active_workbook ? (
          activeWorkbook((workbook) => <span>{workbook.name}</span>)
        ) : (
          <span>No active workbook, create one?</span>
        )}
      </Typography>
    </>
  );
};
