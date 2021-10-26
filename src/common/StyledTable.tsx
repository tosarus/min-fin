import React from 'react';
import { Box, Table, TableContainer, TablePagination, TablePaginationProps, TableProps } from '@mui/material';

interface StyledTableProps extends TableProps {
  pagination?: TablePaginationProps;
}

export const StyledTable = ({ pagination, ...props }: StyledTableProps) => (
  <Box sx={{ overflow: 'hidden', display: 'flex', flexFlow: 'column' }}>
    <TableContainer>
      <Table {...props} stickyHeader size="small" sx={{ '& td, & th': { fontSize: '1rem' } }} />
    </TableContainer>
    {pagination && pagination.count > pagination.rowsPerPage && (
      <TablePagination component="div" sx={{ flexShrink: 0 }} {...pagination} />
    )}
  </Box>
);
