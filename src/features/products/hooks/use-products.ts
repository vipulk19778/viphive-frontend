import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  type ProductInput,
} from "@/services/api/products.service";

export function useProducts(page = 1, limit = 12) {
  return useQuery({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts(page, limit),
  });
}

export function useInfiniteProducts(limit = 12, query = "") {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", limit, query],
    queryFn: ({ pageParam }) => getProducts(pageParam, limit, query),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      input,
    }: {
      productId: string;
      input: ProductInput;
    }) => updateProduct(productId, input),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
