export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface CsvTrans {
  date: string;
  descr: string;
  amount: number;
  type: string;
  category: string;
  account: string;
}
