import { User, UserRole } from '../types/auth';
import api from './api';

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  company: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  company?: string;
  role?: UserRole;
}

export const clientUsersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data.data ? response.data.data.items : [];
  },

  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async toggleBlock(id: string): Promise<User> {
    const response = await api.put(`/users/${id}/toggle-block`);
    return response.data.data;
  },

  async toggleRole(id: string): Promise<User> {
    const response = await api.put(`/users/${id}/toggle-role`);
    return response.data.data;
  },
};
