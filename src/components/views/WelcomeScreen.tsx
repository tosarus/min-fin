import React from 'react';
import { Typography } from '@material-ui/core';
import { Title } from '../common';

export const WelcomeScreen = () => {
  return (
    <>
      <Title>Welcome!</Title>
      <Typography variant="body1">Hi. Please login.</Typography>
    </>
  );
};
