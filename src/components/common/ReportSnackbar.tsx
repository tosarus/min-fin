import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Actions, Selectors } from '../../store';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export const ReportSnackbar = () => {
  const classes = useStyles();
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
      <div className={classes.container}>
        {reports.map((report, i) => {
          return (
            <Alert key={i} elevation={6} severity={report.type} onClose={() => handleClose(report.id)}>
              {report.text}
            </Alert>
          );
        })}
      </div>
    </Snackbar>
  );
};
