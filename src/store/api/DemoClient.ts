import { PrivateClient } from './PrivateClient';
import { PublicClient } from './PublicClient';
import { WeatherForecast, CsvTrans } from '../types';

export class ForecastClient extends PublicClient {
  load(): Promise<WeatherForecast[]> {
    return this.getJson('/api/demo/forecast');
  }
}

export class TransClient extends PrivateClient {
  load(): Promise<CsvTrans[]> {
    return this.getJson('/api/demo/trans');
  }
}
