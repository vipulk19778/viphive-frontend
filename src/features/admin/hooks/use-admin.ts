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

export function useUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: getUsers });
}

export function usePayments(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["admin", "payments", page, limit],
    queryFn: () => getPayments(page, limit),
  });
}
