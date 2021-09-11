import React from 'react';
import { Container, Typography } from '@material-ui/core';
import { Title } from '../common';
import { useAuth0 } from '@auth0/auth0-react';

export const Overview = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Container maxWidth="lg">
      <Title>Overview</Title>
      {isAuthenticated ? (
        <Typography variant="body1">{`Hi, ${user!.name}.`}</Typography>
      ) : (
        <Typography variant="body1">Hi. Please login.</Typography>
      )}
    </Container>
  );
};
