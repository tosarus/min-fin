import React from 'react';
import { Box, IconButton, Typography, TypographyProps } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDispatch, useSelector } from 'react-redux';
import { WorkbookListTable } from './WorkbookListTable';
import { UserListTable } from './UserListTable';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';

const Separator = () => {
  return <Box component="hr" m={3} />;
};

const SectionTitle = (props: TypographyProps) => {
  return <Typography variant="h5" my={1} mx={0} {...props} />;
};

export const Settings = () => {
  const profile = useSelector(Selectors.profile);
  const renderUserList = useDispatchedRender(Selectors.userList, Actions.loadUserList, (list) => list.length == 0);
  const renderWorkbooks = useDispatchedRender(Selectors.workbooks, Actions.listWorkbooks);
  const dispatch = useDispatch();

  const handleRefreshWorkbooks = () => {
    dispatch(Actions.resetWorkbooks());
  };

  return (
    <Box display="flex" px={0} py={2} justifyContent="space-around">
      <Box component="section" flex="1 0 auto">
        <Title>Settings{profile?.is_admin && ' [admin]'}</Title>
        <Separator />
        <SectionTitle>{profile!.is_admin ? 'Users' : 'Your info'}</SectionTitle>
        {renderUserList((userList) => (
          <UserListTable userList={userList} />
        ))}
        <Separator />
        <SectionTitle>
          <span style={{ display: 'inline-block', marginRight: '10px' }}>Workbooks</span>
          <IconButton area-label="refresh workbooks" size="small" onClick={handleRefreshWorkbooks}>
            <RefreshIcon />
          </IconButton>
        </SectionTitle>
        {renderWorkbooks((workbooks) => (
          <WorkbookListTable workbooks={workbooks} />
        ))}
      </Box>
    </Box>
  );
};
