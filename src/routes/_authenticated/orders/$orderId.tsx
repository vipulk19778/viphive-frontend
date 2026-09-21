import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/orders/$orderId")({
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const { orderId } = Route.useParams();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>

      <p className="mt-2 text-gray-600">Order ID: {orderId}</p>
    </main>
  );
}
