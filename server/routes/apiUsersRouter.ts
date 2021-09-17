import express, { Request, Response } from 'express';
import { tools } from '../auth';
import { Configuration } from '../config';
import { Users } from '../dao';

const makeRouter = ({ auth: authConfig }: Configuration) => {
  const router = express.Router();

  router.get('/users', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const callerEmail = tools.getEmailFromRequest(authConfig, req);
    const caller = await Users.findByEmail(callerEmail);

    try {
      res.json(!caller!.is_admin ? [caller!] : await Users.getAll());
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.put('/users', tools.checkToken(authConfig), async (req: Request, res: Response) => {
    const callerEmail = tools.getEmailFromRequest(authConfig, req);
    const user = req.body as Partial<Users.Type>;

    const caller = await Users.findByEmail(callerEmail);
    if (!user.email) {
      user.email = callerEmail;
    }

    if (!caller!.is_admin) {
      if (user.email != caller!.email) {
        res.status(400).send('Can`t update info for other user');
        return;
      }
      delete user.allowed;
      delete user.is_admin;
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
