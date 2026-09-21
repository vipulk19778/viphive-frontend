import { Link } from "@tanstack/react-router";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useProducts } from "@/features/products/hooks/use-products";

export function ProductsPage() {
  const { data, isPending, isError } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  if (isPending)
    return (
      <p className="p-10 text-center text-slate-500">Loading products...</p>
    );
  if (isError)
    return (
      <p className="p-10 text-center text-red-600">Unable to load products.</p>
    );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-200/60 dark:bg-slate-900 dark:shadow-none sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            The VIPHive edit
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
            Find your next favorite.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            A considered collection of products worth making room for. Browse
            the latest arrivals and bring something excellent home.
          </p>
          <a
            href="#catalog"
            className="mt-7 inline-flex rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Shop the collection
          </a>
        </div>
      </section>

      <section id="catalog" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
              Curated for you
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
              Shop products
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.meta.total} items
          </p>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data.map((product) => (
            <article
              key={product._id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <Link
                to="/products/$productId"
                params={{ productId: product._id }}
                className="block overflow-hidden bg-slate-100 dark:bg-slate-800"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="aspect-4/3 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {product.category}
                </p>
                <Link
                  to="/products/$productId"
                  params={{ productId: product._id }}
                >
                  <h3 className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-slate-950 dark:text-white">
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
                    className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
                  >
                    {product.stock > 0 ? "Add to cart" : "Sold out"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
