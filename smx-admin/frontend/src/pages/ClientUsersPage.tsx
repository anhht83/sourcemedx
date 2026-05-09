import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchClientUsers,
  createClientUser,
  updateClientUser,
  deleteClientUser,
  toggleClientUserBlock,
} from '../features/clients/clientUsersSlice';
import { User } from '../types/auth';
import * as yup from 'yup';
import LoadingScreen from '../components/LoadingScreen';
import { useSnackbar } from 'notistack';
import DataTable, { Column } from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Formik } from 'formik';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company: yup.string().required('Company is required'),
  role: yup.string().oneOf(['BUYER', 'SUPPLIER']).required('Role is required'),
});

const ClientUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.clientUsers.users);
  const isLoading = useAppSelector((state) => state.clientUsers.isLoading);
  const error = useAppSelector((state) => state.clientUsers.error);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string | null;
    firstName: string;
    lastName: string;
    action: 'delete' | 'block' | 'unblock';
  }>({
    open: false,
    userId: null,
    firstName: '',
    lastName: '',
    action: 'delete',
  });

  useEffect(() => {
    dispatch(fetchClientUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [error, enqueueSnackbar]);

  const handleClickOpen = () => {
    setOpen(true);
    setEditingUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setOpen(true);
  };

  const handleDeleteClick = (userId: string, firstName: string, lastName: string) => {
    setConfirmDialog({
      open: true,
      userId,
      firstName,
      lastName,
      action: 'delete',
    });
  };

  const handleToggleActiveClick = (
    userId: string,
    firstName: string,
    lastName: string,
    isActive: boolean
  ) => {
    setConfirmDialog({
      open: true,
      userId,
      firstName,
      lastName,
      action: isActive ? 'block' : 'unblock',
    });
  };

  const handleConfirmAction = async () => {
    const { userId, action } = confirmDialog;
    if (!userId) return;

    try {
      setLoadingUserId(userId);
      if (action === 'delete') {
        await dispatch(deleteClientUser(userId));
      } else {
        await dispatch(toggleClientUserBlock(userId));
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || `Failed to ${action} user`;
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    } finally {
      setLoadingUserId(null);
      setConfirmDialog({
        open: false,
        userId: null,
        firstName: '',
        lastName: '',
        action: 'delete',
      });
    }
  };

  const columns: Column<User>[] = [
    {
      id: 'firstName',
      label: 'First Name',
      sortable: true,
      filterable: true,
    },
    {
      id: 'lastName',
      label: 'Last Name',
      sortable: true,
      filterable: true,
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      id: 'company',
      label: 'Company',
      sortable: true,
      filterable: true,
    },
    {
      id: 'role',
      label: 'Role',
      sortable: true,
      filterable: true,
    },
    {
      id: 'isActive',
      label: 'Status',
      sortable: true,
      renderCell: (value: boolean, row: User) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={value ? 'Active' : 'Blocked'}
            color={value ? 'success' : 'error'}
            size="small"
            onClick={() => handleToggleActiveClick(row.id, row.firstName, row.lastName, value)}
            disabled={loadingUserId === row.id}
          />
          <Chip
            label="Delete"
            color="error"
            size="small"
            variant="outlined"
            onClick={() => handleDeleteClick(row.id, row.firstName, row.lastName)}
            disabled={loadingUserId === row.id}
          />
          <Chip
            label="Edit"
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => handleEdit(row)}
            disabled={loadingUserId === row.id}
          />
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingScreen message="Loading users..." />;
  }

  if (users.length === 0 && !isLoading && !open) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No users found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ mt: 2 }}
        >
          Add User
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Client Users Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add Client User
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        defaultSortBy="email"
        getRowId={(row) => row.id}
        emptyStateMessage="No client users found. Click the Add Client User button to create one."
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Formik
          initialValues={
            editingUser
              ? {
                  firstName: users.find((user) => user.id === editingUser)?.firstName || '',
                  lastName: users.find((user) => user.id === editingUser)?.lastName || '',
                  email: users.find((user) => user.id === editingUser)?.email || '',
                  company: users.find((user) => user.id === editingUser)?.company || '',
                  role: users.find((user) => user.id === editingUser)?.role || 'BUYER',
                }
              : {
                  firstName: '',
                  lastName: '',
                  email: '',
                  company: '',
                  role: 'BUYER' as 'BUYER' | 'SUPPLIER',
                }
          }
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (editingUser) {
                const updateData = {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  company: values.company,
                  role: values.role,
                };
                await dispatch(updateClientUser({ id: editingUser, data: updateData }));
              } else {
                await dispatch(createClientUser(values));
              }
              handleClose();
              resetForm();
            } catch (error: any) {
              const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                (editingUser ? 'Failed to update user' : 'Failed to create user');
              enqueueSnackbar(errorMessage, {
                variant: 'error',
                autoHideDuration: 5000,
              });
            }
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <DialogTitle>{editingUser ? 'Edit Client User' : 'Add Client User'}</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <FormField name="firstName" label="First Name" type="text" />
                  <FormField name="lastName" label="Last Name" type="text" />
                  <FormField name="email" label="Email" type="email" disabled={!!editingUser} />
                  <FormField name="company" label="Company" type="text" />
                  <FormField
                    name="role"
                    label="Role"
                    type="select"
                    options={[
                      { value: 'BUYER', label: 'Buyer' },
                      { value: 'SUPPLIER', label: 'Supplier' },
                    ]}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">
                  {editingUser ? 'Update' : 'Add'}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      <ConfirmationDialog
        open={confirmDialog.open}
        title={`${
          confirmDialog.action === 'delete'
            ? 'Delete'
            : confirmDialog.action === 'block'
            ? 'Block'
            : 'Unblock'
        } User`}
        message={`Are you sure you want to ${confirmDialog.action} the user "${
          confirmDialog.firstName
        } ${confirmDialog.lastName}
        }"?${confirmDialog.action === 'delete' ? ' This action cannot be undone.' : ''}`}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmDialog({
            open: false,
            userId: null,
            firstName: '',
            lastName: '',
            action: 'delete',
          })
        }
        confirmButtonText={
          confirmDialog.action === 'delete'
            ? 'Delete'
            : confirmDialog.action === 'block'
            ? 'Block'
            : 'Unblock'
        }
        severity={confirmDialog.action === 'delete' ? 'error' : 'warning'}
      />
    </Box>
  );
};

export default ClientUsersPage;
