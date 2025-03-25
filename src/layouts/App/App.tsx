import React, { useEffect } from 'react';
import { Box, CssBaseline, LinearProgress } from '@mui/material';
import { useAuth } from '../../auth';
import { Footer, ReportSnackbar, useToggle } from '../../common';
import { PublicClient } from '../../store/clients';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { RoutedContent } from './RoutedContent';

export const App = () => {
  const { isReady } = useAuth();
  const [expanded, toggleExpanded] = useToggle(true);
  const [version, setVersion] = React.useState<string>();
  useEffect(() => {
    const fetchVersion = async () => {
      setVersion(await new PublicClient().getVersion());
    };
    fetchVersion().catch(console.error);
  }, [setVersion]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ReportSnackbar />
      <Header expanded={expanded} title="Min-Fin" />
      <Navigation expanded={expanded} toggleExpanded={toggleExpanded} />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', flexGrow: 1, pt: 9 }}>
        {isReady ? <RoutedContent /> : <LinearProgress />}
        <Footer copyname="Vlad-Dev" link="https://vlad-k.dev/" version={version} />
      </Box>
    </Box>
  );
};
