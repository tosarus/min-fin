import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Users } from '../dao';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();

  router.get('/userinfo', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    let user = await Users.findByEmail(email);
    if (!user) {
      const { name, picture } = await tools.fetchAuthUser(authConfig, req);

      user = await Users.save({
        email,
        name,
        picture,
        is_admin: email.includes('aristovlad'),
        allowed: email.includes('aristovlad'),
      });
    }

    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  });

  router.put('/userinfo', tools.checkToken, async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
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
