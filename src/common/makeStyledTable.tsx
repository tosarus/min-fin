import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { AmountSpan } from './AmountSpan';
import { StyledTable } from './StyledTable';

type ColumnType = 'date' | 'amount';
export interface StyledColumn<T> {
  name?: string;
  sx?: SxProps;
  type?: ColumnType;
  value: (item: T) => any;
}

interface Props<T> {
  headers: StyledColumn<T>[];
  items: T[];
  pagination?: boolean;
  withHeader?: boolean;
  sx?: SxProps;
  accentSx?: SxProps;
  detail?: (item: T) => any;
  accent?: (item: T) => any;
  onEdit?: (item: T) => void;
}

const NOOP = () => undefined;

export function renderDetails(text: string) {
  return (
    <Typography variant="body2" sx={{ pt: 0.25 }} color="text.secondary">
      {text}
    </Typography>
  );
}

export function makeStyledTable<T>({
  headers,
  items,
  pagination = true,
  withHeader = true,
  sx,
  accentSx,
  detail = NOOP,
  accent = NOOP,
  onEdit = NOOP,
}: Props<T>) {
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
  const paginationProps = pagination
    ? {
        rowsPerPageOptions: [25, 50, 100],
        count: items.length,
        rowsPerPage,
        page,
        onPageChange,
        onRowsPerPageChange,
      }
    : undefined;
  const slicedItems = pagination ? items.slice(page * rowsPerPage, (page + 1) * rowsPerPage) : items;

  const hasDetails = detail !== NOOP;
  const hasMenu = onEdit !== NOOP;
  const hasAccent = accent !== NOOP;

  // styles
  const headSx = (header: StyledColumn<T>): SxProps => {
    if (header.sx) {
      return header.sx;
    }
    if (header.type === 'date') {
      return { width: 90 };
    } else if (header.type === 'amount') {
      return { maxWidth: 120, textAlign: 'right' };
    } else {
      return {};
    }
  };
  const cellSx = (header: StyledColumn<T>): SxProps => {
    if (header.sx) {
      return header.sx;
    }
    if (header.type === 'date') {
      return { verticalAlign: 'top', borderBottomWidth: '1px !important' };
    } else if (header.type === 'amount') {
      return { textAlign: 'right' };
    } else {
      return {};
    }
  };
  const firstRowSx = (item: T): SxProps => {
    const accentProps = hasAccent && accent(item) ? accentSx : {};
    return hasDetails ? { '& td': { borderBottomWidth: 0, pb: 0 }, ...accentProps } : { ...accentProps };
  };
  const secondRowSx = (item: T): SxProps => {
    const accentProps = hasAccent && accent(item) ? accentSx : {};
    return { '& td': { pt: 0, pb: 0.25 }, ...accentProps };
  };

  return (
    <StyledTable pagination={paginationProps} sx={sx}>
      {withHeader && (
        <TableHead>
          <TableRow>
            {headers.map((h, i) => (
              <TableCell key={i} sx={headSx(h)}>
                {h.name}
              </TableCell>
            ))}
            {hasMenu && <TableCell />}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {slicedItems.map((item, i) => (
          <React.Fragment key={i}>
            <TableRow sx={firstRowSx(item)}>
              {headers.map((h, i) => (
                <TableCell key={i} rowSpan={hasDetails && h.type === 'date' ? 2 : 1} sx={cellSx(h)}>
                  {h.type === 'amount' ? <AmountSpan amount={h.value(item)} /> : h.value(item)}
                </TableCell>
              ))}
              {hasMenu && (
                <TableCell sx={{ width: 30 }}>
                  <IconButton
                    size="small"
                    sx={{ m: 0, p: 0, '& .MuiSvgIcon-root:hover': { color: 'primary.light' } }}
                    onClick={() => onEdit(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
            {hasDetails && (
              <TableRow sx={secondRowSx(item)}>
                <TableCell colSpan={headers.length - (hasMenu ? 0 : 1)}>{detail(item)}</TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </StyledTable>
  );
}
