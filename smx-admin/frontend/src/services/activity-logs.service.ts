import api from './api';

interface ActivityLog {
  id: string;
  admin: {
    id: string;
    email: string;
  };
  entityType: 'ADMIN' | 'USER' | 'ROLE';
  activityType: 'CREATE' | 'UPDATE' | 'DELETE' | 'BLOCK' | 'UNBLOCK' | 'LOGIN' | 'LOGOUT';
  entityId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface PaginatedActivityLogsResponse {
  items: ActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllParams {
  page?: number;
  limit?: number;
  adminId?: string;
  entityType?: 'ADMIN' | 'USER' | 'ROLE';
  activityType?: 'CREATE' | 'UPDATE' | 'DELETE' | 'BLOCK' | 'UNBLOCK' | 'LOGIN' | 'LOGOUT';
  startDate?: string;
  endDate?: string;
}

export const activityLogsService = {
  async getAll(params: GetAllParams): Promise<PaginatedActivityLogsResponse> {
    const response = await api.get('/activity-logs', { params });
    return response.data.data;
  },

  async exportLogs(params: Omit<GetAllParams, 'page' | 'limit'>): Promise<Blob> {
    const response = await api.get('/activity-logs/export', {
      params,
      responseType: 'blob',
    });
    return response.data.data;
  },
};
