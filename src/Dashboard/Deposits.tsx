import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Title } from './Title';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export const Deposits = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <Typography component="p" variant="h4">
        $3,024.00
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2019
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={(event) => event.preventDefault()}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
};
