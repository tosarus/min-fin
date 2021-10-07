import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { LinkProps, useRoute, Link } from 'wouter';

export const ButtonLink = ({ ...props }: ButtonProps & LinkProps) => {
  const [isActive] = useRoute(props.href!);
  const sx = isActive ? { ...props.sx, bgcolor: 'rgba(0,0,0,0.06)' } : props.sx;

  return (
    <Link {...props}>
      <Button {...props} sx={sx} />
    </Link>
  );
};
