import React from 'react';
import { AppBar, Box, Container, CssBaseline, Toolbar } from '@material-ui/core';
import * as Views from './listViews';
import { Brand, Error, Footer, LoginLogout, MenuButton, ReportSnackbar, SwitchPages, RoutablePage } from '../../common';
import { useAuth } from '../../auth';

const renderLinks = (pages: RoutablePage[]) =>
  pages.map((page, i) => (
    <MenuButton key={i} href={page.link}>
      {page.name}
    </MenuButton>
  ));

export const App = () => {
  const { isAuthenticated, isReady, error } = useAuth();

  const viewPages = Views.listViewPages(isAuthenticated);
  const systemPages = Views.listSystemPages(isAuthenticated);
  const notFoundPages = Views.listNotFoundPage(isReady);
  const routedPages = viewPages.concat(systemPages, notFoundPages);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            {isReady ? (
              <SwitchPages pages={routedPages}>{(page) => <Brand title={`Min-Fin App - ${page.name}`} />}</SwitchPages>
            ) : (
              <Brand title="Min-Fin App" />
            )}
            {renderLinks(systemPages)}
            {isReady && <LoginLogout color="inherit" />}
          </Toolbar>
        </Container>
      </AppBar>
      <Box display="flex" flexDirection="column" height="calc(100vh - 64px)">
        {isReady && (
          <Container maxWidth="lg" component="main">
            {error && <Error error={error} />}
            <Toolbar disableGutters>{renderLinks(viewPages)}</Toolbar>
            <SwitchPages pages={routedPages} />
          </Container>
        )}
        <Footer copyname="Vlad-Dev" link="https://vlad-k.dev/" />
      </Box>
      <ReportSnackbar />
    </>
  );
};
