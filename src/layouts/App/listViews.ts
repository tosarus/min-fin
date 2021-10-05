import { SvgIcon } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { Accounts, Forecast, NotFound, Orders, Overview, Settings, Transactions, WelcomeScreen } from '..';

const createRoutablePage = (link: string, component: React.ComponentType, name: string, icon?: typeof SvgIcon) => {
  return { link, component, name, icon };
};
const _systemPages = [createRoutablePage('/settings', Settings, 'Settings')];

const _privatePages = [
  createRoutablePage('/', Overview, 'Overview', AppsIcon),
  createRoutablePage('/accounts', Accounts, 'Accounts', AssignmentOutlinedIcon),
  createRoutablePage('/trans', Transactions, 'Transactions', StorageRoundedIcon),
  createRoutablePage('/orders', Orders, 'Orders', ReceiptLongOutlinedIcon),
  createRoutablePage('/forecast', Forecast, 'Forecast', WbSunnyOutlinedIcon),
];

const _publicPages = [
  createRoutablePage('/', WelcomeScreen, 'Home', AppsIcon),
  createRoutablePage('/forecast', Forecast, 'Forecast', WbSunnyOutlinedIcon),
];

const _notFound = createRoutablePage('/:rest', NotFound, '404');

export const listSystemPages = (isAuthenticated: boolean) => {
  return isAuthenticated ? _systemPages : [];
};

export const listViewPages = (isAuthenticated: boolean) => {
  return isAuthenticated ? _privatePages : _publicPages;
};

export const listNotFoundPage = (isReady: boolean) => {
  return isReady ? [_notFound] : [];
};
