import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Budgets } from '../dao';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();

  router.get('/budgets', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);

    try {
      res.json(await Budgets.getAll(email));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.get('/budgets/active', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);

    try {
      res.json(await Budgets.getActive(email));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.post('/budgets', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const budget = req.body as Partial<Budgets.Type>;

    if (!budget?.name) {
      res.status(400).send('New budget: should have a name');
      return;
    }

    try {
      res.json(await Budgets.create(email, budget));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.put('/budgets', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const budget = req.body as Partial<Budgets.Type>;

    if (!budget) {
      res.status(400).send('Update budget: should have a body');
      return;
    }

    try {
      res.json(await Budgets.update(email, budget));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.delete('/budgets/:id(\\d+)', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const id = +req.params.id;

    try {
      await Budgets.remove(email, id);
      res.json({ id });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
