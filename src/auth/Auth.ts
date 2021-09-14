import { Auth0Client, Auth0ClientOptions, LogoutOptions, RedirectLoginOptions } from '@auth0/auth0-spa-js';

export class Auth {
  private _auth0?: Auth0Client;

  constructor(clientOpts?: Auth0ClientOptions) {
    if (clientOpts) {
      this._auth0 = new Auth0Client(clientOpts);
    }
  }

  checkSession = () => this.auth().checkSession();
  isAuthenticated = () => this.auth().isAuthenticated();
  handleRedirect = () => this.auth().handleRedirectCallback();

  login = (options?: RedirectLoginOptions) => this.auth().loginWithRedirect(options);
  logout = (options?: LogoutOptions) => this.auth().logout(options);
  getToken = () => this.auth().getTokenSilently();

  private auth(): Auth0Client {
    if (!this._auth0) {
      throw new Error('not initialized');
    }
    return this._auth0;
  }
}
