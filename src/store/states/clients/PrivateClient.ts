import { BaseClient } from './BaseClient';
import { Auth } from '../types';

export class PrivateClient extends BaseClient {
  constructor(private _auth: Auth) {
    super();
  }

  protected async createHeaders(): Promise<Headers> {
    const token = await this.getToken();
    return new Headers({ Authorization: `Bearer ${token}` });
  }

  private getToken = () => {
    return this._auth.getToken();
  };
}
