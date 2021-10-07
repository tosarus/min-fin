import { Response, Request } from 'express';
import { Inject } from '@decorators/di';
import { Controller, Get, Response as Res, Request as Req } from '@decorators/express';
import { AUTH_CONFIG } from '../injectTokens';
import { CheckToken } from '../middleware';
import { AuthConfig, tools } from '../../auth';
import { isAdmin, UserRepository } from '../../database';

@Controller('/userinfo', [CheckToken])
export class AuthenticateController {
  constructor(
    @Inject(AUTH_CONFIG) private config_: AuthConfig,
    @Inject(UserRepository) private repository_: UserRepository
  ) {}

  @Get('')
  async authenticate(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    let user = await this.repository_.findByEmail(email);
    if (!user) {
      const { name, picture } = await tools.fetchAuthUser(this.config_, req);

      user = await this.repository_.create({
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
