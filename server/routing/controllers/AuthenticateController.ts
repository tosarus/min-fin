import { Response, Request } from 'express';
import { Inject } from '@decorators/di';
import { Controller, Get, Response as Res, Request as Req } from '@decorators/express';
import { AuthConfig, tools } from '../../auth';
import { UsersService } from '../../services';
import { AUTH_CONFIG } from '../injectTokens';
import { CheckToken } from '../middleware';

@Controller('/userinfo', [CheckToken])
export class AuthenticateController {
  constructor(@Inject(AUTH_CONFIG) private config_: AuthConfig, @Inject(UsersService) private users_: UsersService) {}

  private email(req: Request): string {
    return (req as any).email;
  }

  @Get('')
  async authenticate(@Req() req: Request, @Res() res: Response) {
    const user = await this.users_.getOrAdd(this.email(req), async (email) => {
      const { name, picture } = await tools.fetchAuthUser(this.config_, req);
      return { email, name, picture };
    });
    res.json(await this.users_.getWorldUpdate(user));
  }
}
