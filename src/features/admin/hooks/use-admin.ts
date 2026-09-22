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

export function useUsers(page = 1, limit = 20, query = "") {
  return useQuery({
    queryKey: ["admin", "users", page, limit, query],
    queryFn: () => getUsers(page, limit, query),
  });
}

export function usePayments(page = 1, limit = 20, query = "") {
  return useQuery({
    queryKey: ["admin", "payments", page, limit, query],
    queryFn: () => getPayments(page, limit, query),
  });
}
