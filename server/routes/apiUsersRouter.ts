import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { UserDao, isAdmin } from '../database';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();
  const baseRoute = '/users';

  router.get(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      res.json(isAdmin(email) ? await UserDao.getAll() : [await UserDao.findByEmail(email)]);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.put(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    try {
      const email = tools.getEmailFromRequest(authConfig, req);
      const user = req.body as Partial<UserDao.Type>;

      if (!user.email) {
        user.email = email;
      }

      if (!isAdmin(email)) {
        if (user.email != email) {
          throw 'Can`t update info for other user';
        }
        delete user.allowed;
      }

      res.json(await UserDao.update(user.email, user));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
