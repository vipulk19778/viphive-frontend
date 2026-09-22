import { apiClient } from "@/lib/api/client";
import type {
  Analytics,
  PaginatedPayments,
  PaginatedUsers,
} from "@/features/admin/types/admin.types";

interface ApiResponse<T> {
  data: T;
}

export async function getAnalytics(days = 30) {
  const response = await apiClient.get<ApiResponse<Analytics>>("/analytics", {
    params: { days },
  });
  return response.data.data;
}

export async function getUsers(page = 1, limit = 20, query = "") {
  const response = await apiClient.get<PaginatedUsers>("/auth/users", {
    params: { page, limit, q: query || undefined },
  });
  return response.data;
}

export async function getPayments(page = 1, limit = 20, query = "") {
  const response = await apiClient.get<PaginatedPayments>("/payments", {
    params: { page, limit, q: query || undefined },
  });
  return response.data;
}
