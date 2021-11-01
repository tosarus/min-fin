import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, Typography } from '@mui/material';
import { Selectors } from '../store';

export const AjaxBackdrop = () => {
  const ajax = useSelector(Selectors.ajaxState);

  return (
    <Backdrop component="div" open={ajax.count > 0} sx={{ color: '#fff' }}>
      {ajax.messages.map((text, i) => (
        <Typography key={i} textAlign="center" variant="h3">
          {text}
        </Typography>
      ))}
    </Backdrop>
  );
};
