"use client";

import Link from "next/link";
import { PackageCheck } from "lucide-react";

import { useGetMyOrdersQuery } from "@/services/api/orders.api";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  shipped: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  cancelled: "bg-destructive/10 text-destructive",
};

export function OrdersList() {
  const { data: orders, isLoading, isError, refetch } = useGetMyOrdersQuery();

  if (isLoading) return <div className="mt-8 h-40 animate-pulse rounded-2xl bg-muted" />;
  if (isError) return <div className="mt-8 rounded-2xl border p-6 text-center"><p>Could not load your orders.</p><button type="button" onClick={() => refetch()} className="mt-3 text-sm font-medium text-primary">Try again</button></div>;
  if (!orders?.length) return <section className="mt-8 rounded-2xl border bg-card px-6 py-14 text-center"><PackageCheck className="mx-auto size-8 text-muted-foreground" /><h2 className="mt-4 font-semibold">No orders yet</h2><p className="mt-2 text-sm text-muted-foreground">When you place an order, its delivery updates will appear here.</p><Link href="/" className="mt-5 inline-block text-sm font-medium text-primary">Start shopping</Link></section>;

  return (
    <section className="mt-8 space-y-4">
      {orders.map((order) => (
        <article key={order._id} className="rounded-2xl border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-sm font-medium">Order #{order._id.slice(-6).toUpperCase()}</p><p className="mt-1 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.status]}`}>{order.status}</span>
          </div>
          <div className="my-5 border-t" />
          <div className="flex flex-wrap items-end justify-between gap-4"><p className="text-sm text-muted-foreground">{order.items.reduce((quantity, item) => quantity + item.qty, 0)} item{order.items.length === 1 ? "" : "s"} · Payment {order.paymentStatus}</p><p className="text-lg font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</p></div>
        </article>
      ))}
    </section>
  );
}
