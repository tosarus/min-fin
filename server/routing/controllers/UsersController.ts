import { Service } from 'typedi';
import { UserInfo } from '@shared/types';
import { Body, Controller, Get, Put } from '@tosarus/routing-express';
import { UsersService } from '../../services';
import { CheckToken, Email } from '../middleware';

@Controller('/users', [CheckToken])
@Service()
export class UsersController {
  constructor(private users_: UsersService) {}

  @Get()
  getUsers(@Email() email: string) {
    return this.users_.list(email);
  }

  @Put()
  updateUser(@Email() email: string, @Body() user: Partial<UserInfo>) {
    return this.users_.update(email, user);
  }
}
