import AppsIcon from '@mui/icons-material/Apps';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { SvgIcon } from '@mui/material';
import { Accounts } from './Accounts';
import { Orders } from './Dashboard';
import { DemoForecast, DemoTransactions } from './Demo';
import { NewUserWarning } from './NewUserWarning';
import { NotFound } from './NotFound';
import { Overview } from './Overview';
import { Settings } from './Settings';
import { WelcomeScreen } from './WelcomeScreen';

export const Links = {
  accounts: () => '/accounts',
  accountsNew: (type: string) => `/accounts/new/${type}`,
  accountsView: (id: number) => `/accounts/${id}`,
  demoForecast: () => '/demo/forecast',
  demoOrders: () => '/demo/orders',
  demoTrans: () => '/demo/trans',
  home: () => '/',
  settings: () => '/settings',
  notFound: () => '/404',
} as const;

export const Routes = {
  Accounts: '/accounts/:all*',
  AccountsNew: '/accounts/new/:type',
  AccountsView: '/accounts/:id',
  DemoForecast: Links.demoForecast(),
  DemoOrders: Links.demoOrders(),
  DemoTrans: Links.demoTrans(),
  Home: Links.home(),
  Settings: Links.settings(),
  NotFound: '/:rest',
} as const;

const createRoutablePage = (
  link: string,
  route: string,
  component: React.ComponentType,
  name: string,
  icon?: typeof SvgIcon
) => {
  return { link, component, name, icon, route };
};

const _newUserPages = [
  createRoutablePage(Links.home(), Routes.Home, NewUserWarning, 'Home', AppsIcon),
  createRoutablePage(Links.demoForecast(), Routes.DemoForecast, DemoForecast, 'Forecast', WbSunnyOutlinedIcon),
];

const _systemPages = [createRoutablePage(Links.settings(), Routes.Settings, Settings, 'Settings')];

const _privatePages = [
  createRoutablePage(Links.home(), Routes.Home, Overview, 'Overview', AppsIcon),
  createRoutablePage(Links.accounts(), Routes.Accounts, Accounts, 'Accounts', AssignmentOutlinedIcon),
  createRoutablePage(Links.demoTrans(), Routes.DemoTrans, DemoTransactions, 'Demo/Transactions', StorageRoundedIcon),
  createRoutablePage(Links.demoOrders(), Routes.DemoOrders, Orders, 'Demo/Orders', ReceiptLongOutlinedIcon),
  createRoutablePage(Links.demoForecast(), Routes.DemoForecast, DemoForecast, 'Demo/Forecast', WbSunnyOutlinedIcon),
];

const _publicPages = [
  createRoutablePage(Links.home(), Routes.Home, WelcomeScreen, 'Home', AppsIcon),
  createRoutablePage(Links.demoForecast(), Routes.DemoForecast, DemoForecast, 'Forecast', WbSunnyOutlinedIcon),
];

const _notFound = createRoutablePage(Links.notFound(), Routes.NotFound, NotFound, '404');

export const listSystemPages = (isAuthenticated: boolean) => {
  return isAuthenticated ? _systemPages : [];
};

export const listViewPages = (isAuthenticated: boolean, fullContent: boolean) => {
  return isAuthenticated ? (fullContent ? _privatePages : _newUserPages) : _publicPages;
};

export const listRoutedPages = (isAuthenticated: boolean, fullContent: boolean) => {
  const routedPages = [];
  if (!isAuthenticated) {
    routedPages.push(..._publicPages);
  } else if (fullContent) {
    routedPages.push(..._privatePages);
    routedPages.push(..._systemPages);
  } else {
    routedPages.push(..._newUserPages);
    routedPages.push(..._systemPages);
  }
  routedPages.push(_notFound);
  return routedPages;
};
