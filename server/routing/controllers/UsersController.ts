import { Response, Request } from 'express';
import { Body, Controller, Get, Put, Response as Res, Request as Req } from '@decorators/express';
import { UserInfo } from '@shared/types';
import { CheckToken } from '../middleware';
import { isAdmin, UserDao } from '../../database';

@Controller('/users', [CheckToken])
export class UsersController {
  @Get('')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    const email = (req as any).email;
    res.json(isAdmin(email) ? await UserDao.getAll() : [await UserDao.findByEmail(email)]);
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

    res.json(await UserDao.update(user.email, user));
  }
}
