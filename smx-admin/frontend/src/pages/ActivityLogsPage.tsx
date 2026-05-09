import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Button,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchActivityLogs, exportActivityLogs } from '../features/activity/activityLogsSlice';
import { Download as DownloadIcon } from '@mui/icons-material';

type EntityType = 'ADMIN' | 'USER' | 'ROLE';
type ActivityType = 'CREATE' | 'UPDATE' | 'DELETE' | 'BLOCK' | 'UNBLOCK' | 'LOGIN' | 'LOGOUT';

interface Filters {
  entityType?: EntityType;
  activityType?: ActivityType;
  startDate?: string;
  endDate?: string;
}

const ActivityLogsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, total } = useAppSelector((state) => state.activityLogs);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    dispatch(
      fetchActivityLogs({
        page: page + 1,
        limit,
        ...filters,
      })
    );
  }, [dispatch, page, limit, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
    setPage(0);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
    setPage(0);
  };

  const handleExport = async () => {
    const response = await dispatch(exportActivityLogs(filters)).unwrap();
    const url = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'activity-logs.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <FormControl fullWidth>
              <InputLabel>Entity Type</InputLabel>
              <Select
                name="entityType"
                value={filters.entityType || ''}
                onChange={handleSelectChange}
                label="Entity Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ROLE">Role</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <FormControl fullWidth>
              <InputLabel>Activity Type</InputLabel>
              <Select
                name="activityType"
                value={filters.activityType || ''}
                onChange={handleSelectChange}
                label="Activity Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="CREATE">Create</MenuItem>
                <MenuItem value="UPDATE">Update</MenuItem>
                <MenuItem value="DELETE">Delete</MenuItem>
                <MenuItem value="BLOCK">Block</MenuItem>
                <MenuItem value="UNBLOCK">Unblock</MenuItem>
                <MenuItem value="LOGIN">Login</MenuItem>
                <MenuItem value="LOGOUT">Logout</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <TextField
              type="date"
              name="startDate"
              label="Start Date"
              value={filters.startDate || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <TextField
              type="date"
              name="endDate"
              label="End Date"
              value={filters.endDate || ''}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid sx={{ flexBasis: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              fullWidth
            >
              Export Logs
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Admin</TableCell>
              <TableCell>Entity Type</TableCell>
              <TableCell>Activity Type</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.admin.email}</TableCell>
                <TableCell>{log.entityType}</TableCell>
                <TableCell>{log.activityType}</TableCell>
                <TableCell>{JSON.stringify(log.details, null, 2)}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default ActivityLogsPage;
