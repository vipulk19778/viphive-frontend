import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingBag, Star } from "lucide-react";

import { useProduct } from "@/features/products/hooks/use-products";
import { useCartStore } from "@/features/cart/store/cart.store";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { data: product, isPending, isError } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);

  if (isPending)
    return (
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-5 py-10">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </main>
    );
  if (isError || !product)
    return <p className="p-10 text-center text-red-600">Product not found.</p>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-amber-600 dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </Link>
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] md:items-center">
        <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
            {product.category}
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="h-4 w-4 fill-current" />{" "}
              {product.rating.toFixed(1)}
            </span>
            <span>({product.numReviews} reviews)</span>
          </div>
          <p className="mt-6 text-3xl font-bold text-slate-950 dark:text-white">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
            {product.description}
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" />{" "}
            {product.stock > 0
              ? `${product.stock} available now`
              : "Currently unavailable"}
          </div>
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
            className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
          >
            <ShoppingBag className="h-5 w-5" />
            {product.stock > 0 ? "Add to cart" : "Out of stock"}
          </button>
        </section>
      </div>
    </main>
  );
}
