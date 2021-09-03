import React from 'react';
import { useDispatch } from 'react-redux';
import Notification from './Notification';
import { useReports, Actions } from '../store';

import css from './notifications.module.css';

interface ContainerProps {
  removeOnClick?: boolean;
}

const Container = ({ removeOnClick = true }: ContainerProps) => {
  const reports = useReports();
  const dispatch = useDispatch();

  const handleClick = (reportId: string) => {
    if (removeOnClick) {
      dispatch(Actions.reportRemove(reportId));
    }
  };

  return (
    <div className={css.container}>
      {reports.map((report, i) => {
        return <Notification key={i} report={report} onClick={handleClick} />;
      })}
    </div>
  );
};

export default Container;
