import { PrivateClient } from './PrivateClient';
import { UserInfo } from '../types';

export class UserClient extends PrivateClient {
  async getUserInfo(): Promise<UserInfo> {
    return await this.getJson('/api/userinfo');
  }

  async updateUserInfo(user: Partial<UserInfo>): Promise<UserInfo> {
    return await this.putJson('/api/userinfo', user);
  }
}
