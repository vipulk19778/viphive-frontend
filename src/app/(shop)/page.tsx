import { ProductGrid } from "@/features/products/components/product-grid";

export default function HomePage() {
  return (
    <main>
      <section className="border-b bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0,transparent_42%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            The considered marketplace
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
            Discover your next everyday favourite.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            A curated collection of well-made finds, delivered simply.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Fresh picks</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">Shop products</h2>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">Free delivery on every order</p>
        </div>
        <ProductGrid />
      </section>
    </main>
  );
}
