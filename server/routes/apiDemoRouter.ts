import express from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Forecasts, Trans } from '../demo';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();
  const baseRoute = '/demo';

  router.get(baseRoute + '/forecast', async (req, res) => {
    try {
      res.json(await Forecasts.getForecast());
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get(baseRoute + '/trans', tools.checkToken(authConfig), async (req, res) => {
    try {
      res.json(await Trans.getTransactions());
    } catch (error) {
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
