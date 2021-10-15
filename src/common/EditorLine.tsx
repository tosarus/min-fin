import React from 'react';
import { Box, BoxProps, Typography } from '@mui/material';

export interface EditorLineProps {
  label: string;
  htmlFor: string;
  children: React.ReactChild;
}

export const EditorLine = ({ sx, label, htmlFor, children }: EditorLineProps & BoxProps) => {
  return (
    <Box sx={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', mb: 2, ...sx }}>
      <Typography component="label" htmlFor={htmlFor} sx={{ pr: 2, flex: '0 1 auto', width: 110 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};
