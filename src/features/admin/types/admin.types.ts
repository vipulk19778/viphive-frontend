import type { User } from "@/features/auth/types/auth.types";
import type { Order } from "@/features/orders/types/order.types";

export interface Analytics {
  window: { days: number; from: string; to: string };
  summary: {
    totalOrders: number;
    totalRevenue: number;
    verifiedPayments: number;
    createdPayments: number;
    failedPayments: number;
    successRate: number;
  };
  statusBreakdown: Array<{ _id: string; count: number; revenue: number }>;
  recentTrend: Array<{ _id: string; count: number; revenue: number }>;
}

export interface AdminPayment extends Order {
  paymentId?: string | null;
  razorpayOrderId?: string | null;
}

export interface PaginatedPayments {
  data: AdminPayment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export type AdminUser = User & { verified?: boolean; createdAt?: string };
