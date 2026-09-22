import { createFileRoute } from "@tanstack/react-router";

import { ProductDetailPage as ProductDetailScreen } from "@/features/products/pages/ProductDetailPage";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailRoute,
});

function ProductDetailRoute() {
  return <ProductDetailScreen productId={Route.useParams().productId} />;
}
