import { Auth0ContextInterface } from '@auth0/auth0-react';
import { BaseClient } from './BaseClient';

export class PrivateClient extends BaseClient {
  private _auth: Auth0ContextInterface;

  constructor(auth: Auth0ContextInterface) {
    super();
    this._auth = auth;
  }

  protected async createHeaders(): Promise<Headers> {
    const token = await this.getToken();
    return new Headers({ Authorization: `Bearer ${token}` });
  }

  private getToken(): Promise<string> {
    return this._auth.getAccessTokenSilently();
  }
}
