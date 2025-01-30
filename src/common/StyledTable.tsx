import React from 'react';
import { Box, Table, TableContainer, TablePagination, TablePaginationProps, TableProps } from '@mui/material';

interface StyledTableProps extends TableProps {
  pagination?: TablePaginationProps;
}

export const StyledTable = ({ pagination, sx, ...props }: StyledTableProps) => (
  <Box sx={{ overflow: 'hidden', display: 'flex', flexFlow: 'column' }}>
    <TableContainer>
      <Table stickyHeader size="small" {...props} sx={{ '& td, & th': { fontSize: '0.95rem' }, ...sx }} />
    </TableContainer>
    {pagination && <TablePagination component="div" sx={{ flexShrink: 0, mr: 2 }} {...pagination} />}
  </Box>
);
