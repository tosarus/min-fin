import { WeatherForecast } from '@shared/types';

const summaries = ['Freezing', 'Bracing', 'Chilly', 'Cool', 'Mild', 'Warm', 'Balmy', 'Hot', 'Sweltering', 'Scorching'];
const getRandInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
};

export const getForecast = (): Promise<WeatherForecast[]> =>
  Promise.resolve(
    [...Array(5).keys()]
      .map((index) => ({
        date: addDays(new Date(), index).toDateString(),
        temp: getRandInt(-20, 55),
        summary: summaries[getRandInt(0, summaries.length)],
      }))
      .map(({ date, temp, summary }) => ({
        date,
        temperatureC: temp,
        temperatureF: 32 + (temp * 9) / 5,
        summary,
      }))
  );
