import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { LinkProps, useRoute, Link } from 'wouter';

export const ButtonLink = ({ ...props }: ButtonProps & LinkProps) => {
  const [isActive] = useRoute(props.href!);

  return (
    <Link {...props}>
      <Button sx={isActive ? { fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.06)' } : {}} {...props} />
    </Link>
  );
};
