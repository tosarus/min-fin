import { PrivateClient, PublicClient } from '../clients';
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
