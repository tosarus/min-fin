import { PrivateClient } from '../clients';
import { UserInfo } from '../types';

export class UsersClient extends PrivateClient {
  getUserInfo(): Promise<UserInfo> {
    return this.getJson('/api/userinfo');
  }

  list(): Promise<UserInfo[]> {
    return this.getJson('/api/users');
  }

  update(user: Partial<UserInfo>): Promise<UserInfo> {
    return this.putJson('/api/users', user);
  }
}
