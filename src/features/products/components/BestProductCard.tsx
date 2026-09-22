import { Link } from "@tanstack/react-router";

import { Chip } from "@/components/ui/Chip";
import type { Product } from "@/features/products/types/product.types";
import { formatCurrency } from "@/utils/format-currency";
import { optimizeImageUrl } from "@/utils/optimize-image-url";

type BestProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function BestProductCard({
  product,
  priority = false,
}: BestProductCardProps) {
  return (
    <Link
      to="/products/$productId"
      params={{ productId: product._id }}
      className="group flex h-44 overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:h-48"
    >
      <img
        src={optimizeImageUrl(product.imageUrl, 320)}
        alt={product.name}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        width="160"
        height="144"
        className="h-full w-[42%] object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="min-w-0 flex-1 p-4">
        <p className="brand-accent truncate text-[11px] font-bold uppercase tracking-[0.14em]">
          {product.category}
        </p>
        <h2 className="mt-2 line-clamp-2 text-base font-bold leading-5 text-slate-950 dark:text-white">
          {product.name}
        </h2>
        <Chip
          variant="success"
          className="mt-3 rounded px-1.5 py-0.5 text-[11px]"
        >
          {product.rating.toFixed(1)} ★
        </Chip>
        <p className="mt-3 text-lg font-bold text-slate-950 dark:text-white">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}
