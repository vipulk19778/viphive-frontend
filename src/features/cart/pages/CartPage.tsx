import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCartStore } from "@/features/cart/store/cart.store";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="font-display mt-6 text-3xl font-bold text-slate-950 dark:text-white">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
            Add some products to your cart to continue.
          </p>
          <Link
            to="/products"
            className="brand-primary brand-primary-hover mt-6 inline-block rounded-xl px-5 py-3 text-sm font-bold transition"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl overflow-x-clip px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
            Ready when you are
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold text-slate-950 dark:text-white">
            Your cart
          </h1>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} product{items.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:gap-4"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"
                />
              )}
              <div className="min-w-0 flex-1 pt-4 sm:pt-0">
                <div>
                  <h2 className="truncate font-bold text-slate-950 dark:text-white">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    aria-label={`Decrease ${item.name} quantity`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-bold text-slate-950 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    aria-label={`Increase ${item.name} quantity`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto cursor-pointer rounded-lg p-1 text-left text-sm font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-400/10"
                  >
                    <Trash2 className="mr-1 inline h-4 w-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit min-w-0 max-w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Order summary
          </h2>
          <div className="mt-6 flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
            <span className="font-bold text-slate-950 dark:text-white">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>
          <Link
            to="/checkout"
            className="brand-primary brand-primary-hover mt-6 block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold transition"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
