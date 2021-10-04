import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Workbooks } from '../dao';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();

  router.get('/workbooks', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);

    try {
      res.json(await Workbooks.getAll(email));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.get('/workbooks/active', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);

    try {
      res.json(await Workbooks.getActive(email));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.post('/workbooks', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const workbook = req.body as Partial<Workbooks.Type>;

    if (!workbook?.name) {
      res.status(400).send('New workbook: should have a name');
      return;
    }

    try {
      res.json(await Workbooks.create(email, workbook));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.put('/workbooks', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const workbook = req.body as Partial<Workbooks.Type>;

    if (!workbook) {
      res.status(400).send('Update workbook: should have a body');
      return;
    }

    try {
      res.json(await Workbooks.update(email, workbook));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  router.delete('/workbooks/:id(\\d+)', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const id = +req.params.id;

    try {
      res.json(await Workbooks.remove(email, id));
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
