import React from 'react';
import { Box, Link, Typography } from '@mui/material';

export const Footer = ({ copyname, link, version }: { copyname: string; link: string; version?: string }) => (
  <Box sx={{ mt: 'auto', pt: 2, pb: 2 }}>
    <Typography variant="body2" color="text.secondary" align="center">
      {`© ${new Date().getFullYear()} `}
      <Link color="inherit" href={link} underline="hover">
        {copyname}
      </Link>
      {version && ` ${version}`}
    </Typography>
  </Box>
);
