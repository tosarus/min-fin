import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@mui/material';
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
    setAdding(true);
  };

  const handleCancelNew = () => {
    setAdding(false);
  };

  const handleSave = (workbook: Partial<Workbook>) => {
    setAdding(false);
    dispatch(Actions.saveWorkbook(workbook));
  };

  const handleActive = (workbook: Workbook) => {
    if (workbook.id !== profile!.active_workbook) {
      dispatch(Actions.updateProfile({ active_workbook: workbook.id }));
    }
  };

  const handleRemove = (workbook: Workbook) => {
    if (workbook.id === profile!.active_workbook) {
      dispatch(Actions.reportWarning('can`t remove active workbook'));
    } else {
      dispatch(Actions.removeWorkbook(workbook.id));
    }
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Active</TableCell>
          <TableCell sx={{ width: 200 }} />
        </TableRow>
      </TableHead>
      <TableBody>
        {workbooks.map((workbook) => (
          <TableRow key={workbook.id}>
            <TableCell>
              <EditableString
                value={workbook.name}
                name="Name"
                onChanged={(name) => handleSave({ id: workbook.id, name })}
              />
            </TableCell>
            <TableCell onClick={() => handleActive(workbook)}>
              {workbook.id === profile?.active_workbook ? 'Yes' : 'No'}
            </TableCell>
            <TableCell sx={{ textAlign: 'right' }}>
              <Button size="small" onClick={() => handleRemove(workbook)}>
                Remove
              </Button>
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
                onChanged={(name: string) => handleSave({ name })}
                onCancel={handleCancelNew}
              />
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        )}
      </TableBody>
      {!adding && (
        <TableFooter>
          <TableRow sx={{ '& td': { border: 0 } }}>
            <TableCell>
              <Button size="small" onClick={handleAddNew}>
                Add new
              </Button>
            </TableCell>
            <TableCell />
            <TableCell />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};
