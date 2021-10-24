import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, TypographyProps } from '@mui/material';
import { Title, useDispatchedRender } from '../../common';
import { Actions, Selectors } from '../../store';
import { TransactionManager } from './TransactionManager';
import { UserListTable } from './UserListTable';
import { WorkbookListTable } from './WorkbookListTable';

const Separator = () => {
  return <Box component="hr" sx={{ my: 3 }} />;
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
    <Box component="section" sx={{ maxWidth: 'md', width: '100%', pb: 2, px: 3, mx: 'auto', overflowY: 'auto' }}>
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
          <Separator />
          <SectionTitle>Transactions</SectionTitle>
          <TransactionManager />
        </>
      )}
    </Box>
  );
};
