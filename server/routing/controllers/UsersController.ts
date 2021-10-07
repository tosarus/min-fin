import { Response, Request } from 'express';
import { Body, Controller, Get, Put, Response as Res, Request as Req } from '@decorators/express';
import { UserInfo } from '@shared/types';
import { CheckToken } from '../middleware';
import { isAdmin, UserRepository } from '../../database';
import { Inject } from '@decorators/di';

@Controller('/users', [CheckToken])
export class UsersController {
  constructor(@Inject(UserRepository) private repository_: UserRepository) {}

  @Get('')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(isAdmin(email) ? await this.repository_.getAll() : [await this.repository_.findByEmail(email)]);
  }

  @Put('')
  async updateUser(@Req() req: Request, @Res() res: Response, @Body() user: Partial<UserInfo>) {
    const email = (req as any).email;
    if (!user.email) {
      user.email = email as string;
    }

    if (!isAdmin(email)) {
      if (user.email !== email) {
        throw 'Can`t update info for other user';
      }
      delete user.allowed;
    }

    res.json(await this.repository_.update(user.email, user));
  }
}
