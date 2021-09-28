import React from 'react';
import { Box, Link, Typography } from '@material-ui/core';

export const Footer = ({ copyname, link = '#' }: { copyname: string; link?: string }) => (
  <Box mt="auto" pt={4} pb={2}>
    <Typography variant="body2" color="textSecondary" align="center">
      {`© ${new Date().getFullYear()} `}
      <Link color="inherit" href={link}>
        {copyname}
      </Link>{' '}
    </Typography>
  </Box>
);