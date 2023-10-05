import React from 'react';
import { Link, LinkProps, useRoute } from 'wouter';
import { styled } from '@mui/material';

const StyledLink = styled(Link, { shouldForwardProp: (prop) => prop !== 'isActive' })<{ isActive: boolean }>(({ isActive }) => ({
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
}));

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

export const RoundedLink = styled(FlexLink)({
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  paddingLeft: 8,
  paddingRight: 8,
  marginLeft: 8,
  marginRight: 8,
  marginBottom: 8,
  borderRadius: 16,
});
