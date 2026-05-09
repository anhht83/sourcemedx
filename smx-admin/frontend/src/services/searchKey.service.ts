import api from './api';
import { Purchase, UserKeyStats, SearchKeyStats } from '../types/searchKey';

class SearchKeyService {
  async getStats(): Promise<SearchKeyStats> {
    const response = await api.get<{ data: SearchKeyStats }>('/search-keys/stats');
    return response.data.data;
  }

  async getAllPurchases(): Promise<Purchase[]> {
    const response = await api.get<{ data: Purchase[] }>('/search-keys/purchases');
    return response.data.data;
  }

  async getPurchasePaymentDetails(stripePaymentId: string): Promise<Partial<Purchase>> {
    const response = await api.get(`/search-keys/payment-details/${stripePaymentId}`);
    return response.data.data;
  }

  async getAllKeyStatsByUser(): Promise<UserKeyStats[]> {
    const response = await api.get<{ data: UserKeyStats[] }>('/search-keys/stats-by-user');
    return response.data.data;
  }
}

export const searchKeyService = new SearchKeyService();
