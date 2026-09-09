import Link from "next/link";

import { AuthGate } from "@/components/auth/auth-gate";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";

export default function CheckoutPage() {
  return (
    <AuthGate>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/cart" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">← Back to cart</Link>
        <div className="mt-6"><CheckoutForm /></div>
      </main>
    </AuthGate>
  );
}
