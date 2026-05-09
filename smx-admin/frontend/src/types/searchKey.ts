import { User } from './auth';

export enum SearchKeyStatus {
  AVAILABLE = 'AVAILABLE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface Purchase {
  stripePaymentId: string;
  user: User;
  count: number;
  totalPrice: number;
  totalDiscount: number;
  createdAt: string;
  paymentStatus?: string | null;
  paymentAmount?: number | null;
  paymentCurrency?: string | null;
  paymentReceiptUrl?: string | null;
  paymentCreated?: number | null;
}

export interface UserKeyStats {
  user: User;
  stats: SearchKeyStats;
}

export interface SearchKeyStats {
  total: number;
  available: number;
  used: number;
  expired: number;
  cancelled: number;
}
