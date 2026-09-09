import { api } from "./api";

import type { Product, ProductListResponse } from "@/types/product";

interface BackendListResponse<T> {
  success: true;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

interface BackendItemResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, GetProductsParams | void>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: params ?? {},
      }),

      transformResponse: (
        response: BackendListResponse<Product[]>,
      ): ProductListResponse => ({
        products: response.data,
        total: response.meta?.total ?? response.data.length,
        page: response.meta?.page ?? 1,
        limit: response.meta?.limit ?? response.data.length,
        totalPages: response.meta?.totalPages ?? 1,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.products.map((product) => ({
                type: "Product" as const,
                id: product._id,
              })),
              {
                type: "Product" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Product" as const,
                id: "LIST",
              },
            ],
    }),

    getProductById: builder.query<Product, string>({
      query: (productId) => `/products/${productId}`,

      transformResponse: (response: BackendItemResponse<Product>) =>
        response.data,

      providesTags: (_result, _error, productId) => [
        {
          type: "Product",
          id: productId,
        },
      ],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
