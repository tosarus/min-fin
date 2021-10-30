import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography } from '@mui/material';
import { Title } from '../common';
import { Selectors } from '../store';

export const NewUserWarning = () => {
  const profile = useSelector(Selectors.profile);
  return (
    <Container maxWidth="md">
      <Title sx={{ textTransform: 'capitalize' }}>Welcome, {profile?.name ?? 'new user'}!</Title>
      <Typography variant="body1">Please contact site administration for full access.</Typography>
    </Container>
  );
};
