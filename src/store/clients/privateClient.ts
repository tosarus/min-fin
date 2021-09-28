import { BaseClient } from './baseClient';
import { Auth } from '../../auth';

export class PrivateClient extends BaseClient {
  constructor(private _auth: Auth) {
    super();
  }

  protected async createHeaders(): Promise<Headers> {
    const token = await this._auth.getToken();
    return new Headers({ Authorization: `Bearer ${token}` });
  }
}
