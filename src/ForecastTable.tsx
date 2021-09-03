import React from 'react';
import dateFormat from 'dateformat';
import { WeatherForecast } from './store/types';

function formatDate(date: string, format = 'mmm dd', gmt = true) {
  return dateFormat(new Date(date), format, gmt);
}

interface Props {
  forecast: WeatherForecast[];
}

export const ForecastTable = ({ forecast }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Temp. (C)</th>
          <th>Temp. (F)</th>
          <th>Summary</th>
        </tr>
      </thead>
      <tbody>
        {forecast.map((wf) => (
          <tr key={wf.date}>
            <td>{formatDate(wf.date, 'default', false)}</td>
            <td>{wf.temperatureC}</td>
            <td>{wf.temperatureF}</td>
            <td>{wf.summary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
