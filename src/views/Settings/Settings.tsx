import React from 'react';
import { Box, Typography, TypographyProps } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { BudgetListTable } from './BudgetListTable';
import { UserListTable } from './UserListTable';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';

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
      margin: theme.spacing(3),
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
  const profile = useSelector(Selectors.profile);
  const renderUserList = useDispatchedRender(Selectors.userList, Actions.loadUserList, (list) => list.length == 0);
  const renderBudgets = useDispatchedRender(Selectors.budgets, Actions.listBudgets);
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <section>
        <Title>Settings{profile?.is_admin && ' [admin]'}</Title>
        <Separator />
        <SectionTitle>{profile!.is_admin ? 'Users' : 'Your info'}</SectionTitle>
        {renderUserList((userList) => (
          <UserListTable userList={userList} />
        ))}
        <Separator />
        <SectionTitle>Budgets</SectionTitle>
        {renderBudgets((budgets) => (
          <BudgetListTable budgets={budgets} />
        ))}
      </section>
    </Box>
  );
};
