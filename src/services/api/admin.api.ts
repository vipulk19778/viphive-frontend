import { api } from "./api";

import type {
  AdminOrder,
  AdminPayment,
  AdminProductInput,
  AdminUser,
  AnalyticsData,
} from "@/features/admin/types";
import type { Product } from "@/types/product";

interface BackendResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

const productFormData = (input: AdminProductInput) => {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("description", input.description);
  formData.append("price", String(input.price));
  formData.append("category", input.category);
  formData.append("stock", String(input.stock));
  if (input.image) formData.append("image", input.image);
  return formData;
};

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsData, number | void>({
      query: (days = 30) => ({ url: "/analytics", params: { days } }),
      transformResponse: (response: BackendResponse<AnalyticsData>) =>
        response.data,
    }),
    getAdminOrders: builder.query<
      BackendResponse<AdminOrder[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: "/orders", params: params ?? {} }),
      transformResponse: (response: BackendResponse<AdminOrder[]>) => response,
      providesTags: ["Order"],
    }),
    updateOrderStatus: builder.mutation<
      AdminOrder,
      { id: string; status: AdminOrder["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      transformResponse: (response: BackendResponse<AdminOrder>) =>
        response.data,
      invalidatesTags: ["Order", "Cart"],
    }),
    getAdminPayments: builder.query<
      BackendResponse<AdminPayment[]>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: "/payments", params: params ?? {} }),
      transformResponse: (response: BackendResponse<AdminPayment[]>) =>
        response,
      providesTags: ["Order"],
    }),
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => "/auth/users",
      transformResponse: (response: BackendResponse<AdminUser[]>) =>
        response.data,
    }),
    createAdminProduct: builder.mutation<Product, AdminProductInput>({
      query: (input) => ({
        url: "/products",
        method: "POST",
        body: productFormData(input),
      }),
      transformResponse: (response: BackendResponse<Product>) => response.data,
      invalidatesTags: ["Product"],
    }),
    updateAdminProduct: builder.mutation<
      Product,
      { id: string; input: AdminProductInput }
    >({
      query: ({ id, input }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productFormData(input),
      }),
      transformResponse: (response: BackendResponse<Product>) => response.data,
      invalidatesTags: ["Product"],
    }),
    deleteAdminProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAdminPaymentsQuery,
  useGetAdminUsersQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
} = adminApi;
