import { useQuery } from "@tanstack/react-query";

import { getProductById, getProducts } from "../api/products.api";

export function useProducts(page = 1, limit = 12) {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts(page, limit),
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
  });
}
