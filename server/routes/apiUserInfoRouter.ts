import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { UserDao, isAdmin } from '../database';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();
  const baseRoute = '/userinfo';

  router.get(baseRoute, tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    let user = await UserDao.findByEmail(email);
    if (!user) {
      const { name, picture } = await tools.fetchAuthUser(authConfig, req);

      user = await UserDao.create({
        email,
        name,
        picture,
        allowed: isAdmin(email),
      });
    }

    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
};

export default makeRouter;
