import { apiClient } from "@/lib/api/client";

import type { PaginatedProducts, Product } from "../types/product.types";

interface ApiResponse<T> {
  data: T;
}

export async function getProducts(page = 1, limit = 12) {
  const response = await apiClient.get<PaginatedProducts>("/products", {
    params: { page, limit },
  });

  return response.data;
}

export async function getProductById(productId: string) {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/products/${productId}`,
  );

  return response.data.data;
}
