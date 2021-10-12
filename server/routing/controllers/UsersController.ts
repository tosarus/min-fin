import { Response, Request } from 'express';
import { Inject } from '@decorators/di';
import { Body, Controller, Get, Put, Response as Res, Request as Req } from '@decorators/express';
import { UserInfo } from '@shared/types';
import { UsersService } from '../../services';
import { CheckToken } from '../middleware';

@Controller('/users', [CheckToken])
export class UsersController {
  constructor(@Inject(UsersService) private users_: UsersService) {}

  private email(req: Request): string {
    return (req as any).email;
  }

  @Get('')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    res.json(await this.users_.list(this.email(req)));
  }

  @Put('')
  async updateUser(@Req() req: Request, @Res() res: Response, @Body() user: Partial<UserInfo>) {
    res.json(await this.users_.update(this.email(req), user));
  }
}
