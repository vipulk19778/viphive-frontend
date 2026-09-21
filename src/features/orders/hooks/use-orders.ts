import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "@/services/api/orders.service";

export function useMyOrders() {
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: getMyOrders,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders", "mine"] });
    },
  });
}

export function useAllOrders(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["orders", "all", page, limit],
    queryFn: () => getAllOrders(page, limit),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
