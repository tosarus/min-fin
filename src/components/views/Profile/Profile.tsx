import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(1),
        padding: theme.spacing(3),
      },
    },
    large: {
      width: theme.spacing(20),
      height: theme.spacing(20),
    },
  })
);

export const Profile = () => {
  const { user } = useAuth0();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper>
        <Typography variant="h6">Details</Typography>
        <Typography variant="body1">Name: {user?.name}</Typography>
        <Typography variant="body1">Email: {user?.email}</Typography>
      </Paper>
      <Paper>
        <Typography variant="h6">Picture</Typography>
        <Avatar className={classes.large} src={user?.picture} />
      </Paper>
      <Paper>
        <Typography variant="h6">User JSON</Typography>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Paper>
    </div>
  );
};
