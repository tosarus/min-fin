import { UserInfo, WorldUpdate } from '../../types';
import { PrivateClient } from './privateClient';

export class UsersClient extends PrivateClient {
  authenticate(): Promise<WorldUpdate> {
    return this.getJson('/api/userinfo');
  }

  list(): Promise<UserInfo[]> {
    return this.getJson('/api/users');
  }

  update(user: Partial<UserInfo>): Promise<UserInfo> {
    return this.putJson('/api/users', user);
  }
}
