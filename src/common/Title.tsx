import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export const Title = ({ children, sx, variant }: TypographyProps) => (
  <Typography sx={{ textAlign: 'center', ...sx }} component="h2" variant={variant ?? 'h5'} color="primary" gutterBottom>
    {children}
  </Typography>
);
