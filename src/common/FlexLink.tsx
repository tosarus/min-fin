import React from 'react';
import styled from '@emotion/styled';
import { Link, LinkProps, useRoute } from 'wouter';

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

    '&:hover': {
      background: isActive ? 'rgb(0,0,0,0.1)' : 'rgb(0,0,0,0.04)',
    },
  })
);

interface FlexLinkProps {
  className?: string;
  children: React.ReactNode;
  noActive?: boolean;
}

export const FlexLink = ({ children, noActive, ...props }: FlexLinkProps & LinkProps) => {
  const [isActive] = useRoute(props.href!);
  return (
    <StyledLink {...props} isActive={!noActive && isActive}>
      {children}
    </StyledLink>
  );
};
