import { useQuery } from "@tanstack/react-query";

import {
  getAnalytics,
  getPayments,
  getUsers,
} from "@/services/api/admin.service";

export function useAnalytics(days = 30) {
  return useQuery({
    queryKey: ["admin", "analytics", days],
    queryFn: () => getAnalytics(days),
  });
}

export function useUsers(
  page = 1,
  limit = 20,
  query = "",
  sort = "createdAt-desc",
) {
  return useQuery({
    queryKey: ["admin", "users", page, limit, query, sort],
    queryFn: () => getUsers(page, limit, query, sort),
  });
}

export function usePayments(
  page = 1,
  limit = 20,
  query = "",
  sort = "createdAt-desc",
) {
  return useQuery({
    queryKey: ["admin", "payments", page, limit, query, sort],
    queryFn: () => getPayments(page, limit, query, sort),
  });
}
