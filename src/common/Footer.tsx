import React from 'react';
import { Box, Link, Typography } from '@mui/material';

export const Footer = ({ copyname, link = '#' }: { copyname: string; link?: string }) => (
  <Box mt="auto" pt={4} pb={2}>
    <Typography variant="body2" color="text.secondary" align="center">
      {`© ${new Date().getFullYear()} `}
      <Link color="inherit" href={link} underline="hover">
        {copyname}
      </Link>{' '}
    </Typography>
  </Box>
);
