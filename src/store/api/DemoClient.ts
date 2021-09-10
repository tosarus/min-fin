import { PublicClient } from './PublicClient';
import { WeatherForecast, CsvTrans } from '../types';

export class DemoClient extends PublicClient {
  loadForecast(): Promise<WeatherForecast[]> {
    return this.getJson('/api/demo/forecast');
  }
  loadTransactions(): Promise<CsvTrans[]> {
    return this.getJson('/api/demo/trans');
  }
}
