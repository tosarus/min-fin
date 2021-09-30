import React from 'react';
import { Alert, Typography } from '@mui/material';

export const Error = ({ error }: { error: Error }) => {
  return (
    <Alert severity="error">
      <Typography variant="h5">{error.toString()}</Typography>
      <Typography variant="body1">{error.stack}</Typography>
    </Alert>
  );
};
