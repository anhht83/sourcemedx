import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Button,
  Drawer,
} from '@mui/material';
import { searchKeyService } from '../services/searchKey.service';
import { SearchKeyStats, UserKeyStats } from '../types/searchKey';
import DataTable, { Column } from '../components/DataTable';
import TableSkeleton from './TableSkeleton';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

const statColors: Record<string, 'success' | 'default' | 'error' | 'warning'> = {
  available: 'success',
  used: 'default',
  expired: 'error',
  cancelled: 'warning',
};

function exportToCSV(data: UserKeyStats[], _columns: Column<UserKeyStats>[]) {
  // Add stat columns explicitly
  const header = ['Email', 'Company', 'Role', 'Total', 'Available', 'Used', 'Expired', 'Cancelled'];
  const rows = data.map((row) => [
    row.user.email,
    row.user.company || '-',
    row.user.role,
    row.stats.total,
    row.stats.available,
    row.stats.used,
    row.stats.expired,
    row.stats.cancelled,
  ]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'user-key-stats.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export const SearchKeyList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserKeyStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filteredStats, setFilteredStats] = useState<UserKeyStats[]>([]);
  const [stats, setStats] = useState<SearchKeyStats | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UserKeyStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsData, ustats] = await Promise.all([
          searchKeyService.getStats(),
          searchKeyService.getAllKeyStatsByUser(),
        ]);
        setUserStats(ustats);
        setFilteredStats(ustats);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load user key stats');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredStats(userStats);
    } else {
      const s = search.toLowerCase();
      setFilteredStats(
        userStats.filter(
          (row) =>
            row.user.email.toLowerCase().includes(s) ||
            (row.user.company || '').toLowerCase().includes(s)
        )
      );
    }
  }, [search, userStats]);

  const columns: Column<UserKeyStats>[] = [
    {
      id: 'user',
      label: 'Email',
      sortable: true,
      renderCell: (_value, row) => row.user.email,
    },
    {
      id: 'user',
      label: 'Company',
      renderCell: (_value, row) => row.user.company || '-',
    },
    {
      id: 'user',
      label: 'Role',
      renderCell: (_value, row) => row.user.role || '-',
    },
    {
      id: 'stats',
      label: 'Stats',
      sortable: false,
      renderCell: (_value, row) => (
        <Stack direction="row" spacing={1}>
          <Chip label={`Total: ${row.stats.total}`} color="default" size="small" disabled />
          <Chip
            label={`Avail: ${row.stats.available}`}
            color={statColors.available}
            size="small"
            disabled
          />
          <Chip label={`Used: ${row.stats.used}`} color={statColors.used} size="small" disabled />
          <Chip
            label={`Exp: ${row.stats.expired}`}
            color={statColors.expired}
            size="small"
            disabled
          />
          <Chip
            label={`Canc: ${row.stats.cancelled}`}
            color={statColors.cancelled}
            size="small"
            disabled
          />
        </Stack>
      ),
    },
  ];

  const handleRowClick = (row: UserKeyStats) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={5} sx={{ mb: 5 }}>
        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 12' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Search Key Stats by User
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', alignItems: 'center' }}>
                {stats && (
                  <>
                    <Typography>Total: {stats.total}</Typography>
                    <Typography color="success.main">Available: {stats.available}</Typography>
                    <Typography color="text.secondary">Used: {stats.used}</Typography>
                    <Typography color="error">Expired: {stats.expired}</Typography>
                    <Typography color="warning.main">Cancelled: {stats.cancelled}</Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          placeholder="Search by email or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 260 }}
        />
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => exportToCSV(filteredStats, columns)}
        >
          Export CSV
        </Button>
      </Stack>
      {loading ? (
        <TableSkeleton rowCount={8} columnCount={columns.length} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <DataTable
          columns={columns}
          data={filteredStats}
          isLoading={loading}
          getRowId={(row) => row.user.id}
          emptyStateMessage="No user key stats found"
          onRowClick={handleRowClick}
        />
      )}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          {selectedRow && (
            <>
              <Typography>
                <b>Email:</b> {selectedRow.user.email}
              </Typography>
              <Typography>
                <b>First Name:</b> {selectedRow.user.firstName}
              </Typography>
              <Typography>
                <b>Last Name:</b> {selectedRow.user.lastName}
              </Typography>
              <Typography>
                <b>Company:</b> {selectedRow.user.company || '-'}
              </Typography>
              <Typography>
                <b>Role:</b> {selectedRow.user.role}
              </Typography>
              <Typography>
                <b>Created At:</b> {new Date(selectedRow.user.createdAt).toLocaleString()}
              </Typography>
              <Typography sx={{ mt: 2 }} variant="subtitle1">
                Key Stats
              </Typography>
              <Stack direction="column" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Total: ${selectedRow.stats.total}`}
                  color="default"
                  size="small"
                  disabled
                />
                <Chip
                  label={`Available: ${selectedRow.stats.available}`}
                  color={statColors.available}
                  size="small"
                  disabled
                />
                <Chip
                  label={`Used: ${selectedRow.stats.used}`}
                  color={statColors.used}
                  size="small"
                  disabled
                />
                <Chip
                  label={`Expired: ${selectedRow.stats.expired}`}
                  color={statColors.expired}
                  size="small"
                  disabled
                />
                <Chip
                  label={`Cancelled: ${selectedRow.stats.cancelled}`}
                  color={statColors.cancelled}
                  size="small"
                  disabled
                />
              </Stack>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};
