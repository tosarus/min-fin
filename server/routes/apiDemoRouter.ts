import express from 'express';
import { Configuration } from '../config';
import { Forecasts, Trans } from '../demo';

const makeRouter = (config: Configuration) => {
  const router = express.Router();
  config;

  router.get('/demo/forecast', (req, res) => {
    const forecast = Forecasts.getForecast();
    res.json(forecast);
  });

  router.get('/demo/trans', (req, res) => {
    const trans = Trans.getTransactions();
    res.json(trans);
  });

  return router;
};

export default makeRouter;
