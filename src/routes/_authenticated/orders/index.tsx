import { createFileRoute } from "@tanstack/react-router";

import { useMyOrders } from "@/features/orders/hooks/use-orders";

export const Route = createFileRoute("/_authenticated/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  const { data: orders, isPending, isError } = useMyOrders();

  if (isPending) return <p className="p-6">Loading orders...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Unable to load orders.</p>;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 && (
          <p className="text-gray-600">You have no orders yet.</p>
        )}
        {orders.map((order) => (
          <article key={order._id} className="rounded-lg border bg-white p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <p className="font-semibold">Order #{order._id.slice(-8)}</p>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {order.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              {order.items.length} item(s) ·{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2 font-semibold">
              ₹{order.totalAmount.toFixed(2)}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
