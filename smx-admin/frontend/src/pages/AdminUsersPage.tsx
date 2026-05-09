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
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  toggleAdminUserBlock,
} from '../features/admin/adminUsersSlice';
import { AdminUser } from '../features/admin/adminUsersSlice';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import DataTable, { Column } from '../components/DataTable';
import FormField from '../components/FormField';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { Formik } from 'formik';
import { ADMIN_ROLES } from '../app/constants';

const passwordValidation = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const validationSchema = (isEditing: boolean) =>
  yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    username: yup
      .string()
      .min(4, 'Username should be at least 4 characters')
      .required('Username is required'),
    password: isEditing ? yup.string() : passwordValidation.required('Password is required'),
    roleName: yup.string().required('Role is required'),
  });

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.adminUsers.users);
  const { user } = useAppSelector((state) => state.auth);
  const isLoading = useAppSelector((state) => state.adminUsers.isLoading);
  const error = useAppSelector((state) => state.adminUsers.error);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string | null;
    username: string;
    action: 'delete' | 'block' | 'unblock';
  }>({
    open: false,
    userId: null,
    username: '',
    action: 'delete',
  });

  useEffect(() => {
    dispatch(fetchAdminUsers());
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

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user.id);
    setOpen(true);
  };

  const handleDeleteClick = (userId: string, username: string) => {
    setConfirmDialog({
      open: true,
      userId,
      username,
      action: 'delete',
    });
  };

  const handleToggleActiveClick = (userId: string, username: string, isActive: boolean) => {
    setConfirmDialog({
      open: true,
      userId,
      username,
      action: isActive ? 'block' : 'unblock',
    });
  };

  const handleConfirmAction = async () => {
    const { userId, action } = confirmDialog;
    if (!userId) return;

    try {
      setLoadingUserId(userId);
      if (action === 'delete') {
        await dispatch(deleteAdminUser(userId));
      } else {
        await dispatch(toggleAdminUserBlock(userId));
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
      setConfirmDialog({ open: false, userId: null, username: '', action: 'delete' });
    }
  };

  const hasAccessEdit = user?.permissions.includes('CREATE_ADMINS');

  const columns: Column<AdminUser>[] = [
    {
      id: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      id: 'username',
      label: 'Username',
    },
    {
      id: 'roleName',
      label: 'Role',
      sortable: true,
      filterable: true,
    },
  ];

  const editColumn: Column<AdminUser> = {
    id: 'isActive',
    label: 'Status',
    sortable: true,
    renderCell: (value: boolean, row: AdminUser) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Chip
          label={value ? 'Active' : 'Blocked'}
          color={value ? 'success' : 'error'}
          size="small"
          onClick={() => handleToggleActiveClick(row.id, row.username, value)}
        />
        <Chip
          label="Delete"
          color="error"
          size="small"
          variant="outlined"
          onClick={() => handleDeleteClick(row.id, row.username)}
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
  };

  if (hasAccessEdit) {
    columns.push(editColumn);
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Admin Users Management</Typography>
        {hasAccessEdit && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
            Add Admin User
          </Button>
        )}
      </Box>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        defaultSortBy="email"
        getRowId={(row) => row.id}
        emptyStateMessage="No admin users found. Click the Add Admin User button to create one."
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Formik
          initialValues={
            editingUser
              ? {
                  email: users.find((user) => user.id === editingUser)?.email || '',
                  username: users.find((user) => user.id === editingUser)?.username || '',
                  password: '',
                  roleName: users.find((user) => user.id === editingUser)?.roleName || '',
                }
              : {
                  email: '',
                  username: '',
                  password: '',
                  roleName: '',
                }
          }
          validationSchema={validationSchema(!!editingUser)}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (editingUser) {
                const updateData = {
                  username: values.username,
                  roleName: values.roleName,
                };
                await dispatch(updateAdminUser({ id: editingUser, data: updateData }));
              } else {
                await dispatch(createAdminUser(values));
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
              <DialogTitle>{editingUser ? 'Edit Admin User' : 'Add Admin User'}</DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <FormField name="username" label="Username" type="text" />
                  <FormField name="email" label="Email" type="email" disabled={!!editingUser} />
                  {!editingUser && <FormField name="password" label="Password" type="password" />}
                  <FormField name="roleName" label="Role" type="select" options={ADMIN_ROLES} />
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
          confirmDialog.username
        }"?${confirmDialog.action === 'delete' ? ' This action cannot be undone.' : ''}`}
        onConfirm={handleConfirmAction}
        onCancel={() =>
          setConfirmDialog({ open: false, userId: null, username: '', action: 'delete' })
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

export default AdminUsersPage;
