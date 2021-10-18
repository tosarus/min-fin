import express from 'express';
import { Container } from '@decorators/di';
import { attachControllers, ERROR_MIDDLEWARE } from '@decorators/express';
import { Configuration } from '../config';
import { QueryManager } from '../database';
import {
  AccountsController,
  AuthenticateController,
  DemoController,
  TransactionsController,
  UsersController,
  WorkbooksController,
} from './controllers';
import { AUTH_CONFIG } from './injectTokens';
import { ApiErrorMiddleware } from './middleware';

export const makeRouter = ({ auth: authConfig }: Configuration) => {
  Container.provide([
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: ERROR_MIDDLEWARE, useClass: ApiErrorMiddleware },
    { provide: QueryManager, useValue: new QueryManager() },
  ]);

  const router = express.Router();
  attachControllers(router, [
    AuthenticateController,
    AccountsController,
    DemoController,
    TransactionsController,
    UsersController,
    WorkbooksController,
  ]);
  return router;
};
