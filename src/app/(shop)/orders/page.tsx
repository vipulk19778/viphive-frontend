import { AuthGate } from "@/components/auth/auth-gate";
import { OrdersList } from "@/features/orders/components/orders-list";

export default function OrdersPage() {
  return (
    <AuthGate>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-sm font-medium text-muted-foreground">Account</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your orders</h1>
        <OrdersList />
      </main>
    </AuthGate>
  );
}
