import { Link, createFileRoute } from "@tanstack/react-router";

import { useProducts } from "@/features/products/hooks/use-products";
import { useCartStore } from "@/features/cart/store/cart.store";

export const Route = createFileRoute("/products/")({
  component: ProductsPage,
});

function ProductsPage() {
  const { data, isPending, isError } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isPending) {
    return <p className="p-8 text-center">Loading products...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-600">Unable to load products.</p>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            VIPHive collection
          </p>
          <h1 className="mt-1 text-3xl font-bold">Products</h1>
        </div>
        <p className="text-sm text-gray-500">{data.meta.total} items</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.data.map((product) => (
          <article
            key={product._id}
            className="overflow-hidden rounded-lg border bg-white"
          >
            <Link to="/products/$productId" params={{ productId: product._id }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </Link>
            <div className="p-4">
              <p className="text-xs uppercase text-gray-500">
                {product.category}
              </p>
              <Link
                to="/products/$productId"
                params={{ productId: product._id }}
              >
                <h2 className="mt-1 font-semibold">{product.name}</h2>
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="font-semibold">
                  ₹{product.price.toFixed(2)}
                </span>
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
                  className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {product.stock > 0 ? "Add to cart" : "Out of stock"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
