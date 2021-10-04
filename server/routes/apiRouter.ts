import express from 'express';
import demo from './apiDemoRouter';
import userInfo from './apiUserInfoRouter';
import users from './apiUsersRouter';
import workbooks from './apiWorkbooksRouter';
import { Configuration } from '../config';

const makeRouter = (config: Configuration) => {
  const router = express.Router();
  router.use('/api', demo(config));
  router.use('/api', userInfo(config));
  router.use('/api', users(config));
  router.use('/api', workbooks(config));
  return router;
};

export default makeRouter;
