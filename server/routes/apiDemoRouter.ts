import express from 'express';
import { Configuration } from '../config';
import { Forecasts } from '../demo';

const makeRouter = (config: Configuration) => {
  const router = express.Router();
  config;

  router.get('/forecast', (req, res) => {
    const forecast = Forecasts.getForecast();
    res.json(forecast);
  });

  return router;
};

export default makeRouter;
