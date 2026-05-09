import { AdminUser } from '../types/auth';
import api from './api';

interface CreateAdminDto {
  email: string;
  password: string;
  username: string;
  roleName: string;
}

interface UpdateAdminDto {
  username?: string;
  roleName?: string;
}

export const adminUsersService = {
  async getAll(): Promise<AdminUser[]> {
    const response = await api.get('/admin');
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  async getById(id: string): Promise<AdminUser> {
    const response = await api.get(`/admin/${id}`);
    return response.data.data;
  },

  async create(data: CreateAdminDto): Promise<AdminUser> {
    const response = await api.post('/admin', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateAdminDto): Promise<AdminUser> {
    const response = await api.put(`/admin/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/${id}`);
  },

  async toggleBlock(id: string): Promise<AdminUser> {
    const response = await api.put(`/admin/${id}/toggle-block`);
    return response.data.data;
  },
};
