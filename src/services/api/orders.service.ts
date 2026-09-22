import { apiClient } from "@/lib/api/client";
import type {
  CreateOrderRequest,
  Order,
} from "@/features/orders/types/order.types";

interface ApiResponse<T> {
  data: T;
}
interface PaginatedOrdersResponse {
  data: Order[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function createOrder(payload: CreateOrderRequest) {
  const response = await apiClient.post<ApiResponse<Order>>("/orders", payload);
  return response.data.data;
}

export async function getMyOrders() {
  const response =
    await apiClient.get<ApiResponse<Order[]>>("/orders/my-orders");
  return response.data.data;
}

export async function getAllOrders(
  page = 1,
  limit = 20,
  query = "",
  sort = "createdAt-desc",
) {
  const response = await apiClient.get<PaginatedOrdersResponse>("/orders", {
    params: { page, limit, q: query || undefined, sort },
  });
  return response.data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const response = await apiClient.put<ApiResponse<Order>>(
    `/orders/${orderId}/status`,
    { status },
  );
  return response.data.data;
}
