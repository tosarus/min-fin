import React from 'react';
import { Typography } from '@mui/material';

export const Title = ({ children }: { children: React.ReactNode }) => (
  <Typography align="center" component="h2" variant="h5" color="primary" gutterBottom>
    {children}
  </Typography>
);
