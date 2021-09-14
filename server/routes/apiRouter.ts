import express from 'express';
import demo from './apiDemoRouter';
import userInfo from './apiUserInfoRouter';
import { Configuration } from '../config';

const makeRouter = (config: Configuration) => {
  const router = express.Router();
  router.use('/api', demo(config));
  router.use('/api', userInfo(config));
  return router;
};

export default makeRouter;
