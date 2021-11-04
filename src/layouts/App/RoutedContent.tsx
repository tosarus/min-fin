import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'wouter';
import { Box } from '@mui/material';
import { useAuth } from '../../auth';
import { Error } from '../../common';
import { Selectors } from '../../store';
import { listRoutedPages } from '../listViews';

export const RoutedContent = () => {
  const { isAuthenticated, error } = useAuth();
  const profile = useSelector(Selectors.profile);
  const fullContent = profile?.allowed ?? false;
  const routedPages = listRoutedPages(isAuthenticated, fullContent);

  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column', minHeight: '0%', width: '100%' }}>
      {error && <Error error={error} />}
      <Switch>
        {routedPages.map(({ link, route, component: Page }, i) => (
          <Route path={route ?? link} key={i}>
            <Page />
          </Route>
        ))}
      </Switch>
    </Box>
  );
};
