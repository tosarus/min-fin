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
    Trans.getTransactions()
      .then((trans) => res.json(trans))
      .catch((err) => res.status(501).send(err));
  });

  return router;
};

export default makeRouter;
