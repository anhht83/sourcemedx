import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getSessions, revokeSession } from '../features/auth/authSlice';
import LoadingScreen from '../components/LoadingScreen';

const SessionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sessions, isLoadingSessions } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);

  const handleRevoke = async (tokenId: string) => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      await dispatch(revokeSession(tokenId));
    }
  };

  if (isLoadingSessions) {
    return <LoadingScreen />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Active Sessions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Browser/Device</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.userAgent}</TableCell>
                <TableCell>{session.ipAddress}</TableCell>
                <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(session.expiresAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip title="Revoke Session">
                    <IconButton size="small" color="error" onClick={() => handleRevoke(session.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {sessions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No active sessions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SessionsPage;
