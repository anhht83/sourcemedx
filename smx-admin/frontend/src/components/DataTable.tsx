import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import TableSkeleton from './TableSkeleton';

type Order = 'asc' | 'desc';

export interface Column<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

interface Filter {
  field: string;
  value: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  defaultSortBy?: keyof T;
  defaultOrder?: Order;
  onSort?: (field: keyof T, order: Order) => void;
  onFilter?: (filters: Filter[]) => void;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string | number;
  emptyStateMessage?: string;
}

function DataTable<T extends object>({
  columns,
  data,
  isLoading = false,
  defaultSortBy,
  defaultOrder = 'asc',
  onSort,
  onFilter,
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  onRowClick,
  getRowId = () => Math.random(),
  emptyStateMessage = 'No data available',
}: DataTableProps<T>) {
  const [orderBy, setOrderBy] = useState<keyof T | undefined>(defaultSortBy);
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [showFilters, setShowFilters] = useState(false);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    onSort?.(property, newOrder);
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = filters.filter((f) => f.field !== field);
    if (value) {
      newFilters.push({ field, value });
    }
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedAndFilteredData = useMemo(() => {
    let processedData = [...data];

    // Apply filters
    filters.forEach((filter) => {
      processedData = processedData.filter((row) => {
        const value = row[filter.field as keyof T];
        return value?.toString().toLowerCase().includes(filter.value.toLowerCase());
      });
    });

    // Apply sorting
    if (orderBy) {
      processedData.sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return order === 'desc' ? -comparison : comparison;
      });
    }

    return processedData;
  }, [data, filters, order, orderBy]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedAndFilteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedAndFilteredData, page, rowsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  if (isLoading) {
    return <TableSkeleton rowCount={rowsPerPage} columnCount={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <Typography color="textSecondary">{emptyStateMessage}</Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Tooltip title="Toggle Filters">
          <IconButton onClick={() => setShowFilters(!showFilters)}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {showFilters && (
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {columns
            .filter((column) => column.filterable)
            .map((column) => (
              <TextField
                key={String(column.id)}
                label={`Filter ${column.label}`}
                size="small"
                onChange={(e) => handleFilterChange(String(column.id), e.target.value)}
                value={filters.find((f) => f.field === column.id)?.value || ''}
              />
            ))}
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.numeric ? 'right' : 'left'}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                hover
                key={getRowId(row)}
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={String(column.id)} align={column.numeric ? 'right' : 'left'}>
                    {column.renderCell
                      ? column.renderCell(row[column.id], row)
                      : row[column.id]?.toString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={sortedAndFilteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default DataTable;
