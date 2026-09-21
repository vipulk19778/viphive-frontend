import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      <p className="mt-2 text-gray-600">View your payment history here.</p>
    </main>
  );
}
