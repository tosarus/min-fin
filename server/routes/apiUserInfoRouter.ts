import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Users } from '../dao';

const makeRouter = (config: Configuration) => {
  const router = express.Router();

  router.get('/userinfo', tools.checkToken, async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(config.auth, req);
    let user = await Users.findByEmail(email);
    if (!user) {
      const authUser = await tools.fetchAuthUser(config.auth, req);
      user = await Users.save({
        name: authUser.name,
        email: authUser.email,
        locale: authUser.locale,
        avatar: authUser.picture,
        is_admin: authUser.email?.includes('aristovlad'),
        allowed: authUser.email?.includes('aristovlad'),
      });
    }

    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  });

  router.put('/userinfo', tools.checkToken, async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(config.auth, req);
    const newUser = req.body as Users.Type;
    if (!newUser.email) {
      newUser.email = email;
    }

    if (newUser.email !== email && !(await Users.findByEmail(email))?.is_admin) {
      throw new Error('Can`t update info for other user');
    }

    const user = await Users.save(newUser);
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  });

  return router;
};

export default makeRouter;
