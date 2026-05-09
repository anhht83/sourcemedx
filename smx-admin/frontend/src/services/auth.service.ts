import { LoginCredentials, AdminProfile, AdminRole } from '../types/auth';
import api from './api';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post('/auth/login', credentials);
      this.setTokens(data.data.access_token, data.data.refresh_token);
      return data;
    } catch (error: any) {
      throw new Error(
        error.message?.message || 'Login failed. Please check your credentials and try again.'
      );
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    this.clearTokens();
  },

  async getCurrentUser(): Promise<AdminProfile> {
    const userResponse = await api.get('/auth/me');
    const userData = userResponse.data.data;

    // Extract role information
    const role = {
      id: '',
      name: userData.roleName,
      description: '',
      permissions: userData.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as AdminRole;

    const profile: AdminProfile = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      isActive: userData.isActive,
      role: role,
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
    };
    return profile;
  },

  async refreshToken(): Promise<{ access_token: string }> {
    const refresh_token = this.getRefreshToken();
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
    try {
      const response = await api.post('/auth/refresh', { refresh_token });
      if (!response.data.data.access_token) {
        throw new Error('Invalid refresh token response');
      }
      this.setAccessToken(response.data.data.access_token);
      return response.data.data;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  },

  async getSessions(): Promise<Session[]> {
    const response = await api.get('/auth/sessions');
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async revokeSession(tokenId: string): Promise<void> {
    await api.delete(`/auth/sessions/${tokenId}`);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    if (!accessToken || !refreshToken) {
      throw new Error('Invalid tokens provided');
    }
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  setAccessToken(token: string): void {
    if (!token) {
      throw new Error('Invalid access token provided');
    }
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token || null;
  },

  getRefreshToken(): string | null {
    const token = localStorage.getItem('refresh_token');
    return token || null;
  },

  clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  },
};
