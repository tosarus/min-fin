import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
});

export const Brand = ({ title }: { title: string }) => {
  const classes = useStyles();
  return (
    <Typography className={classes.title} variant="h4">
      {title}
    </Typography>
  );
};
