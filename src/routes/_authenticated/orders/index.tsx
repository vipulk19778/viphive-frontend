import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

      <p className="mt-2 text-gray-600">View your order history here.</p>
    </main>
  );
}
