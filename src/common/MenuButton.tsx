import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { LinkProps, useRoute, Link } from 'wouter';

export const MenuButton = ({ ...props }: ButtonProps & LinkProps) => {
  const [isActive] = useRoute(props.href!);

  return (
    <Link {...props}>
      <Button sx={{ mx: 0, my: 1, fontWeight: isActive ? 'bold' : undefined }} color="inherit" {...props} />
    </Link>
  );
};
