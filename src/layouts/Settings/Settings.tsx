import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TypographyProps } from '@mui/material';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { UserListTable } from './UserListTable';
import { WorkbookListTable } from './WorkbookListTable';

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
  const isAdmin = profile?.is_admin ?? false;
  const fullContent = profile?.allowed ?? false;

  return (
    <Box display="flex" px={0} py={2} justifyContent="space-around">
      <Box component="section" flex="1 0 auto">
        <Title>Settings{isAdmin && ' [admin]'}</Title>
        <Separator />
        <SectionTitle>{isAdmin ? 'Users' : 'Your info'}</SectionTitle>
        {renderUserList((userList) => (
          <UserListTable userList={userList} />
        ))}
        <Separator />
        {fullContent && (
          <>
            <SectionTitle>Workbooks</SectionTitle>
            {renderWorkbooks((workbooks) => (
              <WorkbookListTable workbooks={workbooks} />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};
