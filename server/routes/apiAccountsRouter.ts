import express, { Request, Response } from 'express';
import { AuthConfig, tools } from '../auth';
import { Configuration } from '../config';
import { AccountDao, WorkbookDao } from '../database';

const getWorkbook = async (authConfig: AuthConfig, req: Request) => {
  const email = tools.getEmailFromRequest(authConfig, req);
  const workbookId = +req.params.workbookId;
  const wb = (await WorkbookDao.getAll(email)).find((wb) => wb.id === workbookId);
  if (wb) {
    return wb;
  }
  throw `no workbook ${req.params.workbookId} for the user ${email}`;
};

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();
  const baseRoute = '/accounts/:workbookId(\\d+)';

  router.get(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const wb = await getWorkbook(authConfig, req);
      res.json(await AccountDao.getAll(wb.id));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const wb = await getWorkbook(authConfig, req);
      const account = req.body as Partial<AccountDao.Type>;

      if (!account || !account.name || !account.type) {
        throw 'New account: should provide name and type';
      }

      res.json(await AccountDao.create(wb.id, account));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.put(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const wb = await getWorkbook(authConfig, req);
      const account = req.body as Partial<AccountDao.Type>;

      if (!account || !account.id) {
        throw 'Upate account: should provide id';
      }

      res.json(await AccountDao.update(wb.id, account));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.delete(baseRoute + '/:id(\\d+)', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const wb = await getWorkbook(authConfig, req);
      const id = +req.params.id;
      res.json(await AccountDao.remove(wb.id, id));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
