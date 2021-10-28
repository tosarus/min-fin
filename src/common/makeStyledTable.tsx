import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { AmountSpan } from './AmountSpan';
import { StyledTable } from './StyledTable';

type ColumnType = 'date' | 'amount';
export type StyledColumn<T> = { name: string; type?: ColumnType; value: (item: T) => any };

interface Props<T> {
  headers: StyledColumn<T>[];
  items: T[];
  detail?: (item: T) => any;
  onEdit?: (item: T) => void;
  onRemove?: (item: T) => void;
}

const NOOP = () => undefined;

export function makeStyledTable<T>({ headers, items, detail = NOOP, onEdit = NOOP, onRemove = NOOP }: Props<T>) {
  // edit menu
  const [menuAnchor, setMenuAnchor] = React.useState<[HTMLElement, T]>();
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, item: T) => {
    setMenuAnchor([event.currentTarget, item]);
  };
  const handleMenuClose = () => {
    setMenuAnchor(undefined);
  };
  const handleEdit = () => {
    if (menuAnchor) {
      onEdit(menuAnchor[1]);
    }
    handleMenuClose();
  };
  const handleRemove = () => {
    if (menuAnchor) {
      onRemove(menuAnchor[1]);
    }
    handleMenuClose();
  };

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const onPageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const onRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const hasDetails = detail !== NOOP;
  const hasMenu = onEdit !== NOOP || onRemove !== NOOP;

  // styles
  const headSx = (type?: ColumnType): SxProps => {
    if (type === 'date') {
      return { maxWidth: 90 };
    } else if (type === 'amount') {
      return { maxWidth: 120, textAlign: 'right' };
    } else {
      return {};
    }
  };
  const cellSx = (type?: ColumnType): SxProps => {
    if (type === 'date') {
      return { verticalAlign: 'top' };
    } else if (type === 'amount') {
      return { textAlign: 'right' };
    } else {
      return {};
    }
  };
  const firstRow: SxProps = hasDetails ? { '& td:not(:first-child)': { borderBottom: 'none', pb: 0 } } : {};

  return (
    <>
      <Menu id="basic-menu" anchorEl={menuAnchor ? menuAnchor[0] : undefined} open={!!menuAnchor} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleRemove}>Remove</MenuItem>
      </Menu>
      <StyledTable
        sx={{ '& td': { px: 1 } }}
        pagination={{
          rowsPerPageOptions: [25, 50, 100],
          count: items.length,
          rowsPerPage,
          page,
          onPageChange,
          onRowsPerPageChange,
        }}>
        <TableHead>
          <TableRow>
            {headers.map(({ type, name }, i) => (
              <TableCell key={i} sx={headSx(type)}>
                {name}
              </TableCell>
            ))}
            {hasMenu && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, i) => (
            <React.Fragment key={i}>
              <TableRow sx={firstRow}>
                {headers.map(({ type, value }, i) => (
                  <TableCell key={i} rowSpan={hasDetails && type === 'date' ? 2 : 1} sx={cellSx(type)}>
                    {type === 'amount' ? <AmountSpan amount={value(item)} /> : value(item)}
                  </TableCell>
                ))}
                {hasMenu && (
                  <TableCell sx={{ width: 30 }}>
                    <IconButton size="small" sx={{ m: 0, p: 0 }} onClick={(e) => handleMenuOpen(e, item)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
              {hasDetails && (
                <TableRow sx={{ '& td': { pt: 0, pb: 0.25 }, '&:hover button': { display: 'block' } }}>
                  <TableCell colSpan={headers.length - (hasMenu ? 0 : 1)}>
                    <Typography variant="body2" sx={{ pt: 0.25 }} color="text.secondary">
                      {detail(item)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </StyledTable>
    </>
  );
}
