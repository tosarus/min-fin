import React from 'react';
import { AppBar, Avatar, Container, CssBaseline, Toolbar } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Brand, Error, Footer, LoginLogout, MenuButton, ReportSnackbar, SwitchPages, RoutablePage } from './common';
import * as Views from './listViews';
import { useAuth } from '../auth';

const useStyles = makeStyles((theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
  })
);

const renderLinks = (pages: RoutablePage[]) =>
  pages.map((page, i) => (
    <MenuButton key={i} href={page.link}>
      {page.name}
    </MenuButton>
  ));

function App() {
  const { isAuthenticated, isReady, error, user } = useAuth();
  const classes = useStyles();

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
            {isReady && <LoginLogout color="inherit" />}
            {isAuthenticated && user?.picture && <Avatar src={user.picture!} className={classes.small} />}
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" component="main">
        {error && <Error error={error} />}
        <Toolbar>{renderLinks(viewPages)}</Toolbar>
        <SwitchPages pages={routedPages} />
      </Container>
      <Footer copyname="Vlad-Dev" link="https://vlad-k.dev/" />
      <ReportSnackbar />
    </>
  );
}

export default App;
