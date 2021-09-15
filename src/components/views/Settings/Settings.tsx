import React from 'react';
import { Box, Typography, TypographyProps } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../../auth';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../../store';
import { UserListTable } from './UserListTable';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      padding: theme.spacing(0, 2),
      justifyContent: 'space-around',
      '& > section': {
        flex: '1 0 auto',
      },
    },
    separator: {
      margin: theme.spacing(3, 0),
    },
    subTitle: {
      margin: theme.spacing(1, 0),
    },
  })
);

const Separator = () => {
  const classes = useStyles();
  return <hr className={classes.separator} />;
};

const SectionTitle = (props: TypographyProps) => {
  const classes = useStyles();
  return <Typography variant="h5" className={classes.subTitle} {...props} />;
};

export const Settings = () => {
  const { user } = useAuth();
  const { email, name, is_admin } = user!;
  const classes = useStyles();
  const renderUserList = useDispatchedRender(Selectors.userList, Actions.loadUserList, (list) => list.length == 0);

  const details: string[] = [];
  details.push(name);
  if (email !== name) {
    details.push(`(${email})`);
  }
  if (is_admin) {
    details.push('[Admin]');
  }

  return (
    <Box className={classes.root}>
      <section>
        <Title>Settings</Title>
        <Typography>{details.join(' ')}</Typography>
        {renderUserList((userList) => (
          <>
            <Separator />
            <SectionTitle>{is_admin ? 'Users' : 'Your info'}</SectionTitle>
            <UserListTable userList={userList} />
          </>
        ))}
      </section>
    </Box>
  );
};
