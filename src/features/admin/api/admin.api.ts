import { apiClient } from "@/lib/api/client";

import type {
  AdminUser,
  Analytics,
  PaginatedPayments,
} from "../types/admin.types";

interface ApiResponse<T> {
  data: T;
}

export async function getAnalytics(days = 30) {
  const response = await apiClient.get<ApiResponse<Analytics>>("/analytics", {
    params: { days },
  });
  return response.data.data;
}

export async function getUsers() {
  const response = await apiClient.get<ApiResponse<AdminUser[]>>("/auth/users");
  return response.data.data;
}

export async function getPayments(page = 1, limit = 20) {
  const response = await apiClient.get<PaginatedPayments>("/payments", {
    params: { page, limit },
  });
  return response.data;
}
