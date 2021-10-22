import React from 'react';
import { Link, LinkProps, useRoute } from 'wouter';
import styled from '@emotion/styled';

interface ActiveProps {
  isActive?: boolean;
}

const StyledLink = styled(Link, { shouldForwardProp: (prop) => prop !== 'isActive' })<LinkProps & ActiveProps>(
  ({ isActive }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    cursor: 'pointer',
    textDecoration: 'none',

    background: isActive && 'rgb(0,0,0,0.06)',

    color: 'inherit',
    '&:visited': {
      color: 'inherit',
    },

    '&:hover': {
      background: isActive ? 'rgb(0,0,0,0.1)' : 'rgb(0,0,0,0.04)',
    },
  })
);

interface FlexLinkProps {
  className?: string;
  children: React.ReactNode;
  noActive?: boolean;
  route?: string;
}

export const FlexLink = ({ children, noActive, route, ...props }: FlexLinkProps & LinkProps) => {
  const [isActive] = useRoute(route ?? props.href!);
  return (
    <StyledLink {...props} isActive={!noActive && isActive}>
      {children}
    </StyledLink>
  );
};
