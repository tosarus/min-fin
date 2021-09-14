import { Forecast, NotFound, Orders, Overview, Profile, Settings, Transactions, WelcomeScreen } from './views';
import { createRoutablePage } from './common';

const _systemPages = [
  createRoutablePage('/settings', Settings, 'Settings'),
  createRoutablePage('/profile', Profile, 'Profile'),
];

const _privatePages = [
  createRoutablePage('/', Overview, 'Overview'),
  createRoutablePage('/trans', Transactions, 'Transactions'),
  createRoutablePage('/orders', Orders, 'Orders'),
  createRoutablePage('/forecast', Forecast, 'Forecast'),
];

const _publicPages = [createRoutablePage('/', WelcomeScreen, 'Home')];

const _notFound = createRoutablePage('/:rest', NotFound, '404');

export const listSystemPages = (isAuthenticated: boolean) => {
  return isAuthenticated ? _systemPages : [];
};

export const listViewPages = (isAuthenticated: boolean) => {
  return isAuthenticated ? _privatePages : _publicPages;
};

export const listNotFoundPage = () => {
  return [_notFound];
};
