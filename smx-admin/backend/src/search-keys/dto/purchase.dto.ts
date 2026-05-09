import { User } from '@/users/entities/user.entity';

// Purchase DTO
export interface PurchaseInfo {
  stripePaymentId: string;
  user: User;
  count: number;
  totalPrice: number;
  totalDiscount: number;
  createdAt: Date;
  paymentStatus?: string | null;
  paymentAmount?: number | null;
  paymentCurrency?: string | null;
  paymentReceiptUrl?: string | null;
  paymentCreated?: number | null;
}
