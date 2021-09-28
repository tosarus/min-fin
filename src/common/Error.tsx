import React from 'react';
import { Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const Error = ({ error }: { error: Error }) => {
  return (
    <Alert severity="error">
      <Typography variant="h5">{error.toString()}</Typography>
      <Typography variant="body1">{error.stack}</Typography>
    </Alert>
  );
};
