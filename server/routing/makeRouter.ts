import express from 'express';
import { Container } from '@decorators/di';
import { attachControllers, ERROR_MIDDLEWARE } from '@decorators/express';
import {
  AccountsController,
  AuthenticateController,
  DemoController,
  UsersController,
  WorkbooksController,
} from './controllers';
import { AUTH_CONFIG } from './injectTokens';
import { ApiErrorMiddleware } from './middleware';
import { Configuration } from '../config';

export const makeRouter = ({ auth: authConfig }: Configuration) => {
  Container.provide([
    { provide: AUTH_CONFIG, useValue: authConfig },
    { provide: ERROR_MIDDLEWARE, useClass: ApiErrorMiddleware },
  ]);

  const router = express.Router();
  attachControllers(router, [
    AuthenticateController,
    AccountsController,
    DemoController,
    UsersController,
    WorkbooksController,
  ]);
  return router;
};
