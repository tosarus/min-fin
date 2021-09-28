import React from 'react';
import { Route, Switch } from 'wouter';

export const createRoutablePage = (link: string, component: React.ComponentType, name: string) => {
  return { link, component, name };
};

export type RoutablePage = ReturnType<typeof createRoutablePage>;

interface SwitchPagesProps {
  pages: RoutablePage[];
  children?: (page: RoutablePage) => React.ReactNode;
}

export const SwitchPages = ({ pages, children }: SwitchPagesProps) => {
  const renderPage = children || ((page) => page.component);
  return (
    <Switch>
      {pages.map((page, i) => (
        <Route path={page.link} key={i}>
          {renderPage(page)}
        </Route>
      ))}
    </Switch>
  );
};
