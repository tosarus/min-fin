import React from 'react';
import dateFormat from 'dateformat';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { WeatherForecast } from '../../types';

function formatDate(date: string, format = 'mmm dd', gmt = true) {
  return dateFormat(new Date(date), format, gmt);
}

interface Props {
  forecast: WeatherForecast[];
}

const ForecastTable = ({ forecast }: Props) => {
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

export const Forecast = () => {
  const renderForecast = useDispatchedRender(Selectors.forecast, Actions.loadForecast);

  return (
    <>
      <Title>Forecast</Title>
      {renderForecast((forecast) => (
        <ForecastTable forecast={forecast} />
      ))}
    </>
  );
};
