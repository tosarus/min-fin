import { Forecast, NotFound, Orders, Profile, PublicApp, Settings, Transactions } from './views';
import { createRoutablePage } from './common';

const _systemPages = [
  createRoutablePage('/settings', Settings, 'Settings'),
  createRoutablePage('/profile', Profile, 'Profile'),
];

const _viewPages = [
  createRoutablePage('/', PublicApp, 'Overview'),
  createRoutablePage('/trans', Transactions, 'Transactions'),
  createRoutablePage('/orders', Orders, 'Orders'),
  createRoutablePage('/forecast', Forecast, 'Forecast'),
];

const _notFound = createRoutablePage('/:rest', NotFound, '404');

export const listSystemPages = (isAuthenticated: boolean) => {
  return isAuthenticated ? _systemPages : [];
};

export const listViewPages = (isAuthenticated: boolean) => {
  isAuthenticated;
  return _viewPages;
};

export const listNotFoundPage = () => {
  return [_notFound];
};
