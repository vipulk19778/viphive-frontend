import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

import { useMyOrders } from "@/features/orders/hooks/use-orders";

export const Route = createFileRoute("/_authenticated/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  const { data: orders, isPending, isError } = useMyOrders();

  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading orders...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load orders.
      </div>
    );

  return (
    <main className="mx-auto max-w-5xl">
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Account
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            My orders
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track your VIPHive purchases in one place.
          </p>
        </div>
        <ClipboardList className="brand-accent hidden h-7 w-7 sm:block" />
      </div>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <ClipboardList className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 font-semibold text-slate-950 dark:text-white">
              You have no orders yet.
            </p>
          </div>
        )}
        {orders.map((order) => (
          <article
            key={order._id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <p className="font-bold text-slate-950 dark:text-white">
                Order #{order._id.slice(-8)}
              </p>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {order.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {order.items.length} item(s) ·{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 font-bold text-slate-950 dark:text-white">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
