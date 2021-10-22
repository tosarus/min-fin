import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Divider, Toolbar, Typography } from '@mui/material';
import { FlexLink } from '../../common';
import { Selectors } from '../../store';
import { listViewPages } from '../listViews';

const NavigationBox = styled(Box)<{ expanded: boolean }>(({ expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  alignItems: 'stretch',
  background: 'rgba(0, 0, 0, 0.08)',
  borderRight: '1px solid rgba(0, 0, 0, 0.04)',
  transition: 'width 200ms',
  whiteSpace: 'nowrap',
  width: expanded ? 260 : 64,
  paddingTop: 64,
  overflowX: 'hidden',
}));

interface NavigationProps {
  expanded: boolean;
  toggleExpanded: () => void;
}

export const Navigation = ({ expanded, toggleExpanded }: NavigationProps) => {
  const profile = useSelector(Selectors.profile);
  const isAuthenticated = profile ? true : false;
  const fullContent = profile?.allowed ?? false;
  const viewPages = listViewPages(isAuthenticated, fullContent);

  // if (!fullContent) {
  //   return <></>;
  // }

  return (
    <NavigationBox component="nav" expanded={expanded}>
      {viewPages.map(({ link, name, route, icon: PageIcon = CalculateOutlinedIcon }, i) => (
        <FlexLink key={i} href={link} route={route}>
          <PageIcon color="primary" sx={{ width: 48, px: 1, py: 2, boxSizing: 'content-box' }} />
          <Typography color="primary" variant="button" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
        </FlexLink>
      ))}
      <Divider sx={{ mt: 'auto' }} />
      <Toolbar disableGutters sx={{ justifyContent: 'flex-end' }}>
        <Box
          onClick={toggleExpanded}
          sx={{ cursor: 'pointer', p: 2.5, lineHeight: 0, '&:hover': { bgcolor: 'rgb(0,0,0,0.04)' } }}>
          {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </Box>
      </Toolbar>
    </NavigationBox>
  );
};
