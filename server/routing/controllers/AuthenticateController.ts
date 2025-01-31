import { Request } from 'express';
import { Inject, Service } from 'typedi';
import { Controller, Get, Req } from '@tosarus/routing-express';
import { AuthConfig, tools } from '../../auth';
import { UsersService } from '../../services';
import { AUTH_CONFIG } from '../injectTokens';
import { CheckToken, Email } from '../middleware';

@Controller('/userinfo', [CheckToken])
@Service()
export class AuthenticateController {
  constructor(
    @Inject(AUTH_CONFIG) private config_: AuthConfig,
    private users_: UsersService
  ) {}

  @Get()
  async authenticate(@Req() req: Request, @Email() email: string) {
    const user = await this.users_.getOrAdd(email, async (email) => {
      const { name, picture } = await tools.fetchAuthUser(this.config_, req);
      return { email, name, picture };
    });
    return await this.users_.getWorldUpdate(user);
  }
}
