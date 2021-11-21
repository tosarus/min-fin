import React from 'react';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { AppBar, styled, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useAuth } from '../../auth';
import { AjaxBackdrop, ButtonLink, FlexLink, LoginLogout } from '../../common';
import { listSystemPages } from '../listViews';

const BrandLink = styled(FlexLink)({
  marginRight: 'auto',
});

interface HeaderProps {
  expanded: boolean;
  title: string;
}

export const Header = ({ expanded, title }: HeaderProps) => {
  const matches = useMediaQuery('(min-width:600px)');
  const { isAuthenticated, isReady } = useAuth();
  const sxStyle = {
    px: 4,
    color: 'inherit',
    '&:hover': {
      bgcolor: 'rgb(0,0,0,0.06)',
    },
  };
  const systemPages = listSystemPages(isAuthenticated);

  return (
    <AppBar position="fixed">
      <AjaxBackdrop />
      <Toolbar disableGutters sx={{ alignItems: 'stretch' }}>
        <BrandLink href="/" noActive>
          <CalculateOutlinedIcon sx={{ color: 'white', px: 1, width: 48, boxSizing: 'content-box' }} />
          {expanded && (
            <Typography color="white" variant="h5" sx={{ width: 196 }}>
              {title}
            </Typography>
          )}
        </BrandLink>
        {matches &&
          systemPages.map((page, i) => (
            <ButtonLink key={i} href={page.link} sx={sxStyle}>
              {page.name}
            </ButtonLink>
          ))}
        {isReady && <LoginLogout sx={sxStyle} />}
      </Toolbar>
    </AppBar>
  );
};
