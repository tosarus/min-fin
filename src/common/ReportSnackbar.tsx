import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Snackbar } from '@mui/material';
import { Actions, Selectors } from '../store';

export const ReportSnackbar = () => {
  const reports = useSelector(Selectors.reports);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleClose = (reportId: string) => {
    dispatch(Actions.reportRemove(reportId));
  };

  if (open && reports.length == 0) {
    setOpen(false);
  }
  if (open !== reports.length > 0) {
    setOpen(reports.length > 0);
  }

  return (
    <Snackbar open={open}>
      <Box display="flex" flexDirection="column" sx={{ '& > * + *': { mt: 2 } }}>
        {reports.map((report, i) => {
          return (
            <Alert key={i} elevation={6} severity={report.type} onClose={() => handleClose(report.id)}>
              {report.text}
            </Alert>
          );
        })}
      </Box>
    </Snackbar>
  );
};
