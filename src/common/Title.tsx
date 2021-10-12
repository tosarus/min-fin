import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export const Title = ({ sx, children }: { children: React.ReactNode } & TypographyProps) => (
  <Typography sx={{ ...sx, textAlign: 'center' }} component="h2" variant="h5" color="primary" gutterBottom>
    {children}
  </Typography>
);
