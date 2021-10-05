import express, { Request, Response } from 'express';
import { UserInfo } from '@shared/types';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Users } from '../dao';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();

  router.get('/users', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);

    try {
      res.json(Users.isAdmin(email) ? await Users.getAll() : [await Users.findByEmail(email)]);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.put('/users', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    const user = req.body as Partial<UserInfo>;

    if (!user.email) {
      user.email = email;
    }

    if (!Users.isAdmin(email)) {
      if (user.email != email) {
        res.status(400).send('Can`t update info for other user');
        return;
      }
      delete user.allowed;
    }

    try {
      res.json(await Users.update(user.email, user));
    } catch (error) {
      res.status(400).send(error);
    }
  });

  return router;
};

export default makeRouter;
