import React from 'react';
import { Avatar, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../../auth';

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
    wrap: {
      whiteSpace: 'pre-wrap',
      '&:hover': {
        whiteSpace: 'pre',
      },
    },
  })
);

export const Profile = () => {
  const classes = useStyles();
  const { user } = useAuth();

  return (
    <div className={classes.root}>
      <Paper>
        <Typography variant="h6">Details</Typography>
        <Typography variant="body1">Name: {user!.name}</Typography>
        <Typography variant="body1">Email: {user!.email}</Typography>
        <Typography variant="body1">Allowed: {user!.allowed ? 'yes' : 'no'}</Typography>
        <Typography variant="body1">Admin: {user!.is_admin ? 'yes' : 'no'}</Typography>
      </Paper>
      <Paper>
        <Typography variant="h6">Picture</Typography>
        <Avatar className={classes.large} src={user!.picture} />
      </Paper>
    </div>
  );
};
