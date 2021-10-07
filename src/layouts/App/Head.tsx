import React from 'react';
import styled from '@emotion/styled';
import { AppBar, Toolbar, Typography } from '@mui/material';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { ButtonLink, FlexLink, LoginLogout } from '../../common';
import { useAuth } from '../../auth';
import { listSystemPages } from './listViews';

const BrandLink = styled(FlexLink)({
  marginRight: 'auto',
});

interface HeasProps {
  expanded: boolean;
  title: string;
}

export const Head = ({ expanded, title }: HeasProps) => {
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
      <Toolbar disableGutters sx={{ alignItems: 'stretch' }}>
        <BrandLink href="/" noActive>
          <CalculateOutlinedIcon sx={{ color: 'white', px: 1, width: 48, boxSizing: 'content-box' }} />
          {expanded && (
            <Typography color="white" variant="h5" sx={{ width: 196 }}>
              {title}
            </Typography>
          )}
        </BrandLink>
        {systemPages.map((page, i) => (
          <ButtonLink key={i} href={page.link} sx={sxStyle}>
            {page.name}
          </ButtonLink>
        ))}
        {isReady && <LoginLogout sx={sxStyle} />}
      </Toolbar>
    </AppBar>
  );
};
