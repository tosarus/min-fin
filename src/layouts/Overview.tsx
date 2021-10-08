import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { LoadingDots, Title, useDispatchedRender } from '../common';
import { Actions, Selectors } from '../store';

export const Overview = () => {
  const profile = useSelector(Selectors.profile);
  const renderWorkbook = useDispatchedRender(
    Selectors.activeWorkbook,
    Actions.getActiveWorkbook,
    undefined,
    <LoadingDots />
  );

  return (
    <>
      <Title>Overview</Title>
      <Typography variant="body1">{`Hi, ${profile!.name}.`}</Typography>
      <Typography variant="body1">
        Active Workbook:{' '}
        {profile?.active_workbook ? (
          renderWorkbook((workbook) => <span>{workbook.name}</span>)
        ) : (
          <span>No active workbook, create one?</span>
        )}
      </Typography>
    </>
  );
};
