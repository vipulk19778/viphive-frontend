import { api } from "./api";

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  qty: number;
  price: number;
}

export interface Order {
  _id: string;
  items: Array<OrderItem & { product: { name?: string; imageUrl?: string } | string }>;
  totalAmount: number;
  address: ShippingAddress;
  paymentStatus: "created" | "verified" | "failed";
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface CreateOrderInput {
  items: OrderItem[];
  totalAmount: number;
  address: ShippingAddress;
  paymentId?: string | null;
}

interface BackendResponse<T> {
  data: T;
  message?: string;
}

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<Order[], void>({
      query: () => "/orders/my-orders",
      transformResponse: (response: BackendResponse<Order[]>) => response.data,
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation<Order, CreateOrderInput>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      transformResponse: (response: BackendResponse<Order>) => response.data,
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery } = ordersApi;
