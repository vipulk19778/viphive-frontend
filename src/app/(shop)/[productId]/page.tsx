import { ProductDetails } from "@/features/products/components/product-details";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <ProductDetails productId={productId} />
    </main>
  );
}
