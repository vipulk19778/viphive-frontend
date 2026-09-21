import { createFileRoute } from "@tanstack/react-router";

import { ProductsPage } from "@/features/products/pages/ProductsPage";

export const Route = createFileRoute("/")({
  component: ProductsPage,
});
