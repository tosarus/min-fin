import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
import { EditableString } from '../../common';
import { Actions, Selectors } from '../../store';
import { Workbook } from '../../types';

interface WorkbookListTableProps {
  workbooks: Workbook[];
}

export const WorkbookListTable = ({ workbooks }: WorkbookListTableProps) => {
  const profile = useSelector(Selectors.profile);
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);

  const handleAddNew = () => {
    if (!adding) {
      setAdding(true);
    }
  };

  const handleCancelNew = () => {
    setAdding(false);
  };

  const handleNewBugget = (name: string) => {
    setAdding(false);
    dispatch(Actions.createWorkbook({ name }));
  };

  const handleUpdate = (workbook: Workbook, name: string) => {
    dispatch(Actions.updateWorkbook({ id: workbook.id, name }));
  };

  const handleActive = (workbook: Workbook) => {
    if (workbook.id !== profile!.active_workbook) {
      dispatch(Actions.updateProfile({ active_workbook: workbook.id }));
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {workbooks.map((workbook) => (
          <TableRow key={workbook.id}>
            <TableCell>
              <EditableString value={workbook.name} name="Name" onChanged={(name) => handleUpdate(workbook, name)} />
            </TableCell>
            <TableCell onClick={() => handleActive(workbook)}>
              {workbook.id === profile?.active_workbook ? 'Yes' : 'No'}
            </TableCell>
          </TableRow>
        ))}
        {adding && (
          <TableRow>
            <TableCell>
              <EditableString
                value=""
                name="New Workbook Name"
                editing
                onChanged={handleNewBugget}
                onCancel={handleCancelNew}
              />
            </TableCell>
            <TableCell />
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell color="primary" onClick={handleAddNew}>
            Add new
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
};
