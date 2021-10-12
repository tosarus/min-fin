import React from 'react';
import { Typography } from '@mui/material';
import { Title } from '../common';

export const NewUserWarning = () => {
  return (
    <>
      <Title sx={{ textTransform: 'capitalize' }}>Welcome new user</Title>
      <Typography variant="body1">Please contact site administration for full access.</Typography>
    </>
  );
};
