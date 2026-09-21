import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Clock3, XCircle } from "lucide-react";

import { useMyOrders } from "@/features/orders/hooks/use-orders";

export const Route = createFileRoute("/_authenticated/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  const { data: orders, isPending, isError } = useMyOrders();

  if (isPending) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading payments...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load payment history.
      </div>
    );
  }

  return (
    <main>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Account
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            Payments
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Track payments connected to your VIPHive orders.
          </p>
        </div>
        <span className="brand-accent-soft hidden rounded-2xl p-3 sm:block">
          <CreditCard className="h-6 w-6" />
        </span>
      </div>
      {orders.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <CreditCard className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-4 font-bold text-slate-950 dark:text-white">
            No payments yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your payment history will appear here after checkout.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-3">
          {orders.map((order) => {
            const isVerified = order.paymentStatus === "verified";
            const isFailed = order.paymentStatus === "failed";
            const Icon = isVerified
              ? CheckCircle2
              : isFailed
                ? XCircle
                : Clock3;
            return (
              <article
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${isVerified ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400" : isFailed ? "bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-400" : "brand-accent-soft"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()} · Payment
                      record
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-950 dark:text-white">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs font-bold capitalize text-slate-500">
                    {order.paymentStatus}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
