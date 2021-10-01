import React, { useState } from 'react';
import styled from '@emotion/styled';
import { AppBar, Box, Container, CssBaseline, Divider, LinearProgress, Toolbar, Typography } from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Route, Switch } from 'wouter';
import * as Views from './listViews';
import { ButtonLink, Error, FlexLink, Footer, LoginLogout, ReportSnackbar } from '../../common';
import { useAuth } from '../../auth';

const Navigation = styled(Box)<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  alignItems: 'stretch',
  background: 'rgba(0, 0, 0, 0.08)',
  borderRight: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'width 200ms',
  whiteSpace: 'nowrap',
  width: expanded ? 260 : 64,
  paddingTop: 64,
  overflowX: 'hidden',
}));

const BrandLink = styled(FlexLink)({
  marginRight: 'auto',
});

export const App = () => {
  const { isAuthenticated, isReady, error } = useAuth();
  const [expanded, setExpanded] = useState(true);

  const viewPages = Views.listViewPages(isAuthenticated);
  const systemPages = Views.listSystemPages(isAuthenticated);
  const notFoundPages = Views.listNotFoundPage(isReady);
  const routedPages = viewPages.concat(systemPages, notFoundPages);

  const togleNavi = () => setExpanded(!expanded);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar disableGutters sx={{ alignItems: 'stretch' }}>
          <BrandLink href="/" noActive>
            <CalculateOutlinedIcon sx={{ color: 'white', px: 1, width: 48, boxSizing: 'content-box' }} />
            {expanded && (
              <Typography color="white" variant="h5" sx={{ width: 196 }}>
                Min-Fin
              </Typography>
            )}
          </BrandLink>
          {/* <Divider orientation="vertical" flexItem sx={{ ml: 'auto' }} /> */}
          {systemPages.map((page, i) => (
            <ButtonLink key={i} href={page.link} sx={{ px: 4, color: 'inherit' }}>
              {page.name}
            </ButtonLink>
          ))}
          {isReady && <LoginLogout sx={{ px: 4, color: 'inherit' }} />}
        </Toolbar>
      </AppBar>
      <Navigation component="nav" expanded={expanded}>
        {viewPages.map(({ link, name, icon: PageIcon = CalculateOutlinedIcon }, i) => (
          <FlexLink key={i} href={link}>
            <PageIcon color="primary" sx={{ width: 48, px: 1, py: 2, boxSizing: 'content-box' }} />
            <Typography color="primary" variant="button" sx={{ flexGrow: 1 }}>
              {name}
            </Typography>
          </FlexLink>
        ))}
        <Divider sx={{ mt: 'auto' }} />
        <Toolbar disableGutters sx={{ justifyContent: 'flex-end' }}>
          <Box
            onClick={togleNavi}
            sx={{ cursor: 'pointer', p: 2.5, lineHeight: 0, '&:hover': { bgcolor: 'rgb(0,0,0,0.04)' } }}>
            {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Box>
        </Toolbar>
      </Navigation>
      <Box display="flex" flexDirection="column" height="100vh" flexGrow={1} pt={9}>
        {isReady ? (
          <Container maxWidth="lg" component="main" style={{ display: 'flex', flexDirection: 'column', minHeight: '0' }}>
            {error && <Error error={error} />}
            <Switch>
              {routedPages.map(({ link, component: Page }, i) => (
                <Route path={link} key={i}>
                  <Page />
                </Route>
              ))}
            </Switch>
          </Container>
        ) : (
          <LinearProgress />
        )}
        <Footer copyname="Vlad-Dev" link="https://vlad-k.dev/" />
        <ReportSnackbar />
      </Box>
    </Box>
  );
};
