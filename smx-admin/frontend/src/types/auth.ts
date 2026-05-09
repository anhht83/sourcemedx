export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
  admins: AdminUser[];
  createdAt: string;
  updatedAt: string;
}

export type AdminPermission =
  | 'VIEW_ADMINS'
  | 'CREATE_ADMINS'
  | 'UPDATE_ADMINS'
  | 'DELETE_ADMINS'
  | 'BLOCK_ADMINS'
  | 'VIEW_LOGS'
  | 'EXPORT_LOGS';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: object;
}

export interface AdminProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: AdminRole;
  permissions: AdminPermission[];
}

export type UserRole = 'BUYER' | 'SUPPLIER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}
