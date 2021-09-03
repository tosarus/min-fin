import express from 'express';
import demo from './apiDemoRouter';
import { Configuration } from '../config';

const makeRouter = (config: Configuration) => {
  const router = express.Router();
  router.use('/api', demo(config));
  return router;
};

export default makeRouter;
