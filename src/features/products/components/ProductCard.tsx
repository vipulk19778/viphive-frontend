import { Link } from "@tanstack/react-router";

import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import type { Product } from "@/features/products/types/product.types";
import { formatCurrency } from "@/utils/format-currency";
import { optimizeImageUrl } from "@/utils/optimize-image-url";
import { ProductCartControl } from "./ProductCartControl";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      as="article"
      variant="interactive"
      className="group overflow-hidden hover:-translate-y-1 hover:shadow-xl"
    >
      <Link
        to="/products/$productId"
        params={{ productId: product._id }}
        className="relative block overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        <img
          src={optimizeImageUrl(product.imageUrl, 640)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="640"
          height="480"
          className="aspect-4/3 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-rose-600">
            Only {product.stock} left
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="brand-accent text-xs font-bold uppercase tracking-wider">
          {product.category}
        </p>
        <Link to="/products/$productId" params={{ productId: product._id }}>
          <h3 className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <Chip variant="success" className="gap-1 rounded px-2 py-0.5">
            {product.rating.toFixed(1)} ★
          </Chip>
          <span className="text-xs text-slate-400">
            {product.numReviews} reviews
          </span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-slate-950 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          <ProductCartControl product={product} />
        </div>
      </div>
    </Card>
  );
}
