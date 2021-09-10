import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Container, CssBaseline, Toolbar } from '@material-ui/core';
import { Brand, Footer, LoginLogout, MenuButton, ReportSnackbar, SwitchPages, RoutablePage } from './common';
import * as Views from './listViews';

const renderLinks = (pages: RoutablePage[]) =>
  pages.map((page, i) => (
    <MenuButton key={i} href={page.link}>
      {page.name}
    </MenuButton>
  ));

function App() {
  const { isAuthenticated } = useAuth0();
  const viewPages = Views.listViewPages(isAuthenticated);
  const systemPages = Views.listSystemPages(isAuthenticated);
  const notFoundPages = Views.listNotFoundPage();
  const routedPages = viewPages.concat(systemPages, notFoundPages);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <SwitchPages pages={routedPages}>{(page) => <Brand title={`Min-Fin App - ${page.name}`} />}</SwitchPages>
            {renderLinks(systemPages)}
            <LoginLogout color="inherit" />
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" component="main">
        <Toolbar>
          {renderLinks(viewPages)}
          <MenuButton href="/foo">Foo</MenuButton>
        </Toolbar>
        <SwitchPages pages={routedPages} />
      </Container>
      <Footer copyname="Vlad-Dev" link="https://vlad-k.dev/" />
      <ReportSnackbar />
    </>
  );
}

export default App;
