import React from 'react';
import { Box, Link, Typography } from '@material-ui/core';

export const Footer = ({ copyname, link = '#' }: { copyname: string; link?: string }) => (
  <Box pt={4}>
    <Typography variant="body2" color="textSecondary" align="center">
      {`© ${new Date().getFullYear()} `}
      <Link color="inherit" href={link}>
        {copyname}
      </Link>{' '}
    </Typography>
  </Box>
);
