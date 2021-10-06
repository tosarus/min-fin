import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { WorkbookDao } from '../database';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();
  const baseRoute = '/workbooks';

  router.get(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      res.json(await WorkbookDao.getAll(email));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get(baseRoute + '/active', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      res.json(await WorkbookDao.getActive(email));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      const workbook = req.body as Partial<WorkbookDao.Type>;

      if (!workbook?.name) {
        throw 'New workbook: should have a name';
      }

      res.json(await WorkbookDao.create(email, workbook));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.put(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      const workbook = req.body as Partial<WorkbookDao.Type>;

      if (!workbook) {
        throw 'Update workbook: should have a body';
      }

      res.json(await WorkbookDao.update(email, workbook));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.delete(baseRoute + '/:id(\\d+)', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      const id = +req.params.id;
      res.json(await WorkbookDao.remove(email, id));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
