import { Response, Request } from 'express';
import { Controller, Get, Response as Res, Request as Req } from '@decorators/express';
import { Inject } from '@decorators/di';
import { CheckToken } from '../middleware';
import { AUTH_CONFIG } from '../injectTokens';
import { AuthConfig, tools } from '../../auth';
import { UserDao, isAdmin } from '../../database';

@Controller('/userinfo', [CheckToken])
export class AuthenticateController {
  constructor(@Inject(AUTH_CONFIG) private config_: AuthConfig) {}

  @Get('')
  async authenticate(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    let user = await UserDao.findByEmail(email);
    if (!user) {
      const { name, picture } = await tools.fetchAuthUser(this.config_, req);

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
  }
}
