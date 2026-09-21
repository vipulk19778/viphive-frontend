import { createFileRoute } from "@tanstack/react-router";

import { useProduct } from "@/features/products/hooks/use-products";
import { useCartStore } from "@/features/cart/store/cart.store";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { data: product, isPending, isError } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);

  if (isPending) return <p className="p-8 text-center">Loading product...</p>;
  if (isError || !product)
    return <p className="p-8 text-center text-red-600">Product not found.</p>;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="aspect-square w-full rounded-lg object-cover"
      />
      <section className="flex flex-col justify-center">
        <p className="text-sm uppercase text-gray-500">{product.category}</p>
        <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold">
          ₹{product.price.toFixed(2)}
        </p>
        <p className="mt-6 leading-7 text-gray-600">{product.description}</p>
        <p className="mt-4 text-sm text-gray-500">{product.stock} available</p>
        <button
          type="button"
          disabled={product.stock < 1}
          onClick={() =>
            addItem({
              productId: product._id,
              name: product.name,
              price: product.price,
              image: product.imageUrl,
            })
          }
          className="mt-8 w-fit rounded-md bg-black px-5 py-3 font-medium text-white disabled:bg-gray-300"
        >
          {product.stock > 0 ? "Add to cart" : "Out of stock"}
        </button>
      </section>
    </main>
  );
}
