import { BaseClient } from './baseClient';

export class PublicClient extends BaseClient {
  protected createHeaders(): Promise<Headers> {
    return Promise.resolve(new Headers());
  }
}
