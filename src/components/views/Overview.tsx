import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { Title } from '../common';
import { Selectors } from '../../store';

export const Overview = () => {
  const profile = useSelector(Selectors.profile);

  return (
    <>
      <Title>Overview</Title>
      <Typography variant="body1">{`Hi, ${profile!.name}.`}</Typography>
    </>
  );
};
