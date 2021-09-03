import { PublicClient } from './PublicClient';
import { WeatherForecast } from '../types';

export class ForecastClient extends PublicClient {
  load(): Promise<WeatherForecast[]> {
    return this.getJson('/api/forecast');
  }
}
