import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store/cart.store";
import type { Product } from "@/features/products/types/product.types";

type ProductCartControlProps = {
  product: Product;
};

export function ProductCartControl({ product }: ProductCartControlProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItem = useCartStore((state) =>
    state.items.find((item) => item.productId === product._id),
  );
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (cartItem) {
    return (
      <div className="quantity-control inline-flex shrink-0 items-center gap-2 rounded-xl p-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => updateQuantity(product._id, cartItem.quantity - 1)}
          aria-label={`Decrease ${product.name} quantity`}
          className="shrink-0 rounded-lg text-slate-700 dark:text-slate-200"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="min-w-5 shrink-0 text-center text-sm font-bold text-slate-950 dark:text-white">
          {cartItem.quantity}
        </span>
        <Button
          size="icon"
          variant="primary"
          onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
          aria-label={`Increase ${product.name} quantity`}
          className="shrink-0 rounded-lg"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      disabled={product.stock < 1}
      onClick={() =>
        addItem({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
        })
      }
      aria-label={
        product.stock > 0
          ? `Add ${product.name} to cart`
          : `${product.name} is sold out`
      }
      className="rounded-xl p-2 sm:px-3 sm:py-2 sm:text-xs"
    >
      <ShoppingCart className="h-4 w-4 sm:hidden" />
      <span className="hidden sm:inline">
        {product.stock > 0 ? "Add to cart" : "Sold out"}
      </span>
    </Button>
  );
}
