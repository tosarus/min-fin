import React from 'react';
import dateFormat from 'dateformat';
import { WeatherForecast } from './store/types';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

function formatDate(date: string, format = 'mmm dd', gmt = true) {
  return dateFormat(new Date(date), format, gmt);
}

interface Props {
  forecast: WeatherForecast[];
}

export const ForecastTable = ({ forecast }: Props) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Temp. (C)</TableCell>
          <TableCell>Temp. (F)</TableCell>
          <TableCell>Summary</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {forecast.map((wf) => (
          <TableRow key={wf.date}>
            <TableCell>{formatDate(wf.date, 'default', false)}</TableCell>
            <TableCell>{wf.temperatureC}</TableCell>
            <TableCell>{wf.temperatureF}</TableCell>
            <TableCell>{wf.summary}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
