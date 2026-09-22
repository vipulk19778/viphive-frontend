import { Link } from "@tanstack/react-router";

import { Chip } from "@/components/ui/Chip";
import type { Product } from "@/features/products/types/product.types";
import { formatCurrency } from "@/utils/format-currency";

type BestProductCardProps = {
  product: Product;
};

export function BestProductCard({ product }: BestProductCardProps) {
  return (
    <Link
      to="/products/$productId"
      params={{ productId: product._id }}
      className="group flex h-36 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:h-40"
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-2/5 object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="min-w-0 flex-1 p-3">
        <p className="brand-accent truncate text-[11px] font-bold uppercase tracking-wider">
          {product.category}
        </p>
        <h2 className="mt-1 line-clamp-2 font-bold text-slate-950 dark:text-white">
          {product.name}
        </h2>
        <Chip
          variant="success"
          className="mt-2 rounded px-1.5 py-0.5 text-[11px]"
        >
          {product.rating.toFixed(1)} ★
        </Chip>
        <p className="mt-2 font-bold text-slate-950 dark:text-white">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}
