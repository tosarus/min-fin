import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { UserInfo } from '../../../store';

interface UserListTableProps {
  userList: UserInfo[];
}

export const UserListTable = ({ userList }: UserListTableProps) => {
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
            <TableCell>{user.is_admin ? 'Yes' : 'No'}</TableCell>
            <TableCell>{user.allowed ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
