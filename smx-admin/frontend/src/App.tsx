import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Providers } from './app/providers';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import ClientUsersPage from './pages/ClientUsersPage';
import DashboardPage from './pages/DashboardPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import SessionsPage from './pages/SessionsPage';
import { SearchKeysPage } from './pages/SearchKeysPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthInitializer from './components/AuthInitializer';
import { AdminPermission } from './types/auth';
import { PurchasePage } from './pages/PurchasePage';
import './style.css';

function AppRoutes() {
  const adminUserPermissions: AdminPermission[] = ['VIEW_ADMINS'];

  const clientUserPermissions: AdminPermission[] = [];

  const activityLogPermissions: AdminPermission[] = ['VIEW_LOGS'];

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <ProtectedRoute requiredPermissions={adminUserPermissions}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clients"
          element={
            <ProtectedRoute requiredPermissions={clientUserPermissions}>
              <ClientUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="activity"
          element={
            <ProtectedRoute requiredPermissions={activityLogPermissions}>
              <ActivityLogsPage />
            </ProtectedRoute>
          }
        />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="search-keys" element={<SearchKeysPage />} />
        <Route path="purchases" element={<PurchasePage />} />
        <Route path="unauthorized" element={<div>You are not authorized to view this page.</div>} />
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Providers>
      <AuthInitializer>
        <SnackbarProvider>
          <AppRoutes />
        </SnackbarProvider>
      </AuthInitializer>
    </Providers>
  );
}

export default App;
