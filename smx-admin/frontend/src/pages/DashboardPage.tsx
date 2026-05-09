import React, { useEffect } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import {
  People as PeopleIcon,
  SupervisorAccount as AdminIcon,
  TrendingUp as ActivityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchClientUsers } from '../features/clients/clientUsersSlice';
import { fetchAdminUsers } from '../features/admin/adminUsersSlice';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: color,
            borderRadius: 1,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { sx: { color: 'white' } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users: clientUsers, isLoading: isLoadingClients } = useAppSelector(
    (state) => state.clientUsers
  );
  const { users: adminUsers, isLoading: isLoadingAdmins } = useAppSelector(
    (state) => state.adminUsers
  );

  useEffect(() => {
    dispatch(fetchClientUsers());
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const isLoading = isLoadingClients || isLoadingAdmins;

  const activeClients = clientUsers.filter((user) => user.isActive).length;
  // const activeAdmins = adminUsers.filter((user) => user.isActive).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        <Grid component="div" sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard
            title="Total Clients"
            value={clientUsers.length}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid component="div" sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard
            title="Active Clients"
            value={activeClients}
            icon={<ActivityIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid component="div" sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
          <StatCard
            title="Admin Users"
            value={adminUsers.length}
            icon={<AdminIcon />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid component="div" sx={{ width: { xs: '100%', md: '50%' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Client Type Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Buyers: {clientUsers.filter((user) => user.role === 'BUYER').length}
              </Typography>
              <Typography variant="body2">
                Suppliers: {clientUsers.filter((user) => user.role === 'SUPPLIER').length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid component="div" sx={{ width: { xs: '100%', md: '50%' } }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Admin Role Distribution
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Super Admins: {adminUsers.filter((user) => user.roleName === 'SUPER_ADMIN').length}
              </Typography>
              <Typography variant="body2">
                Admins: {adminUsers.filter((user) => user.roleName === 'ADMIN').length}
              </Typography>
              <Typography variant="body2">
                Supports: {adminUsers.filter((user) => user.roleName === 'SUPPORT').length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
