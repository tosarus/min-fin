import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Users } from '../dao';

const makeRouter = ({ auth: authConfig, admins }: Configuration) => {
  const router = express.Router();

  router.get('/userinfo', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const email = tools.getEmailFromRequest(authConfig, req);
    let user = await Users.findByEmail(email);
    if (!user) {
      const { name, picture } = await tools.fetchAuthUser(authConfig, req);

      user = await Users.create({
        email,
        name,
        picture,
        is_admin: admins.includes(email),
        allowed: admins.includes(email),
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
