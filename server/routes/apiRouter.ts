import express from 'express';
import budgets from './apiBudgetsRouter';
import demo from './apiDemoRouter';
import userInfo from './apiUserInfoRouter';
import users from './apiUsersRouter';
import { Configuration } from '../config';

const makeRouter = (config: Configuration) => {
  const router = express.Router();
  router.use('/api', budgets(config));
  router.use('/api', demo(config));
  router.use('/api', userInfo(config));
  router.use('/api', users(config));
  return router;
};

export default makeRouter;
