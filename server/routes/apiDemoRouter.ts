import express from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Forecasts, Trans } from '../demo';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();

  router.get('/demo/forecast', (req, res) => {
    const forecast = Forecasts.getForecast();
    res.json(forecast);
  });

  router.get('/demo/trans', tools.checkToken(authConfig), (req, res) => {
    Trans.getTransactions()
      .then((trans) => res.json(trans))
      .catch((err) => res.status(501).send(err));
  });

  return router;
};

export default makeRouter;
