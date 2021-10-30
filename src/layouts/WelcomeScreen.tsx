import React from 'react';
import { Container, Typography } from '@mui/material';
import { Title } from '../common';

export const WelcomeScreen = () => {
  return (
    <Container maxWidth="md">
      <Title>Welcome!</Title>
      <Typography variant="body1">Hi. Please login.</Typography>
    </Container>
  );
};
