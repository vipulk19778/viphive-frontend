import type { Product } from "@/types/product";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  verified: boolean;
  createdAt: string;
}

export interface AdminOrder {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: Array<{
    qty: number;
    price: number;
    product: { name?: string } | string;
  }>;
  totalAmount: number;
  paymentStatus: "created" | "verified" | "failed";
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  paymentVerifiedAt?: string;
}

export interface AdminPayment extends AdminOrder {
  razorpayOrderId?: string;
  paymentId?: string;
}

export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  verifiedPayments: number;
  createdPayments: number;
  failedPayments: number;
  successRate: number;
}

export interface AnalyticsData {
  window: { days: number; from: string; to: string };
  summary: AnalyticsSummary;
  statusBreakdown: Array<{ _id: string; count: number; revenue: number }>;
  recentTrend: Array<{ _id: string; count: number; revenue: number }>;
}

export interface AdminProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

export type { Product };
