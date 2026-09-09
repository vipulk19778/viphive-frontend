import { CartContent } from "@/features/cart/components/cart-content";

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
        <p className="mt-2 text-muted-foreground">Review your items before checkout.</p>
      </header>
      <CartContent />
    </main>
  );
}
