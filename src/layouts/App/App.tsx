import React, { useState } from 'react';
import { Box, CssBaseline, LinearProgress } from '@mui/material';
import { useAuth } from '../../auth';
import { Footer, ReportSnackbar } from '../../common';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { RoutedContent } from './RoutedContent';

export const App = () => {
  const { isReady } = useAuth();
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header expanded={expanded} title="Min-Fin" />
      <Navigation expanded={expanded} toggleExpanded={toggleExpanded} />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', flexGrow: 1, pt: 9 }}>
        {isReady ? <RoutedContent /> : <LinearProgress />}
        <Footer copyname="Vlad-Dev" link="https://vlad-k.dev/" />
        <ReportSnackbar />
      </Box>
    </Box>
  );
};
