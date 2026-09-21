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

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

function toProductFormData(input: ProductInput) {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("description", input.description);
  formData.append("price", String(input.price));
  formData.append("category", input.category);
  formData.append("stock", String(input.stock));
  if (input.image) formData.append("image", input.image);
  return formData;
}

export async function createProduct(input: ProductInput) {
  const response = await apiClient.post<ApiResponse<Product>>(
    "/products",
    toProductFormData(input),
  );
  return response.data.data;
}

export async function updateProduct(productId: string, input: ProductInput) {
  const response = await apiClient.put<ApiResponse<Product>>(
    `/products/${productId}`,
    toProductFormData(input),
  );
  return response.data.data;
}

export async function deleteProduct(productId: string) {
  await apiClient.delete(`/products/${productId}`);
}
