import { Auth0Client, Auth0ClientOptions, AuthorizationParams, LogoutOptions } from '@auth0/auth0-spa-js';

export interface AuthOptions extends Auth0ClientOptions {
  redirect_uri: string;
  audience: string;
}

export class Auth {
  private _auth0?: Auth0Client;

  constructor(clientOpts?: AuthOptions) {
    if (clientOpts) {
      const { redirect_uri, audience, ...opts } = clientOpts;
      const cacheLocation = clientOpts.cacheLocation || 'localstorage';
      this._auth0 = new Auth0Client({
        authorizationParams: { audience, redirect_uri },
        cacheLocation,
        ...opts,
      });
    }
  }

  checkSession = () => this.auth().checkSession();
  isAuthenticated = () => this.auth().isAuthenticated();
  handleRedirect = () => this.auth().handleRedirectCallback();

  login = (authorizationParams?: AuthorizationParams) => this.auth().loginWithRedirect({ authorizationParams });
  logout = (logoutParams?: LogoutOptions['logoutParams']) => this.auth().logout({ logoutParams });
  getToken = () => this.auth().getTokenSilently();

  private auth(): Auth0Client {
    if (!this._auth0) {
      throw new Error('not initialized');
    }
    return this._auth0;
  }
}
