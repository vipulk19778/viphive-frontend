import { AdminProductsPage } from "@/features/admin/pages/AdminProductsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});
