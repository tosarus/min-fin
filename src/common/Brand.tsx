import React from 'react';
import { Typography } from '@mui/material';

export const Brand = ({ title }: { title: string }) => {
  return (
    <Typography sx={{ flexGrow: 1 }} variant="h4">
      {title}
    </Typography>
  );
};
