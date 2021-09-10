import React from 'react';
import clsx from 'clsx';
import { ButtonProps, Button, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { LinkProps, useRoute, Link } from 'wouter';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      marginLeft: theme.spacing(3),
    },
    menuButtonActive: {
      fontWeight: 'bold',
    },
  })
);

export const MenuButton = ({ ...props }: ButtonProps & LinkProps) => {
  const [isActive] = useRoute(props.href!);
  const classes = useStyles();

  return (
    <Link {...props}>
      <Button className={clsx(classes.menuButton, isActive && classes.menuButtonActive)} color="inherit" {...props} />
    </Link>
  );
};
