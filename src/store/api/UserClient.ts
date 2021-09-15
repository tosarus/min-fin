import { PrivateClient } from './PrivateClient';
import { UserInfo } from '../types';

export class UserClient extends PrivateClient {
  async getUserInfo(): Promise<UserInfo> {
    return await this.getJson('/api/userinfo');
  }

  async list(): Promise<UserInfo[]> {
    return await this.getJson('/api/users');
  }

  async update(user: Partial<UserInfo>): Promise<UserInfo> {
    return await this.putJson('/api/users', user);
  }
}
