import React from 'react';
import { useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Actions } from '../../../store';
import { UserInfo } from '../../../types';

interface UserListTableProps {
  userList: UserInfo[];
}

export const UserListTable = ({ userList }: UserListTableProps) => {
  const dispatch = useDispatch();

  const handleIsAdmin = (user: UserInfo) => {
    dispatch(Actions.updateUser({ email: user.email, is_admin: !user.is_admin }));
  };

  const handleAllowed = (user: UserInfo) => {
    dispatch(Actions.updateUser({ email: user.email, allowed: !user.allowed }));
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>Allowed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userList.map((user) => (
          <TableRow key={user.email}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell onClick={() => handleIsAdmin(user)}>{user.is_admin ? 'Yes' : 'No'}</TableCell>
            <TableCell onClick={() => handleAllowed(user)}>{user.allowed ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
