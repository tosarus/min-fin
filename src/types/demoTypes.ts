export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

type TransactionType = 'debit' | 'credit';

export interface CsvTrans {
  date: string;
  descr: string;
  amount: number;
  type: TransactionType;
  category: string;
  account: string;
}
