import { PrivateClient } from './PrivateClient';
import { WeatherForecast, CsvTrans } from '../types';

export class DemoClient extends PrivateClient {
  loadForecast(): Promise<WeatherForecast[]> {
    return this.getJson('/api/demo/forecast');
  }
  loadTransactions(): Promise<CsvTrans[]> {
    return this.getJson('/api/demo/trans');
  }
}
