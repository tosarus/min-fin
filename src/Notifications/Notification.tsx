import React from 'react';
import { Report } from '../store/types';

import css from './notifications.module.css';

interface NotificationProps {
  report: Report;
  title?: string;
  onClick?: (reportId: string) => void;
}

const Notification = ({ report, title, onClick = () => {} }: NotificationProps) => {
  const className = [css.notification, report.type].join(' ');

  const handleClick = () => {
    onClick(report.id);
  };

  return (
    <div className={className} onClick={handleClick}>
      <div>
        <h4 className={css.title}>{title || report.type}</h4>
        <div>{report.text}</div>
      </div>
    </div>
  );
};

export default Notification;
