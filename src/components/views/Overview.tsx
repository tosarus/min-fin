import React from 'react';
import { Typography } from '@material-ui/core';
import { Title } from '../common';
import { useAuth } from '../../auth';

export const Overview = () => {
  const { user } = useAuth();

  return (
    <>
      <Title>Overview</Title>
      <Typography variant="body1">{`Hi, ${user!.name}.`}</Typography>
    </>
  );
};
