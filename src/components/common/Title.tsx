import React from 'react';
import Typography from '@material-ui/core/Typography';

export const Title = ({ children }: { children: React.ReactNode }) => (
  <Typography align="center" component="h2" variant="h6" color="primary" gutterBottom>
    {children}
  </Typography>
);
