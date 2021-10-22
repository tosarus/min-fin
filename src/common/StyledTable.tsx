import React from 'react';
import { Table, TableProps } from '@mui/material';

export const StyledTable = (props: TableProps) => (
  <Table {...props} stickyHeader size="small" sx={{ '& td, & th': { fontSize: '1rem' } }} />
);
