"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import type { Product } from "@/types/product";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/slices/cart.slice";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isOutOfStock = product.stock <= 0;
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.productId === product._id),
  );

  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/${product._id}`} className="block">
        <div className="relative aspect-[4/4.5] overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="space-y-2 p-4 pb-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {product.category}
          </p>
          <h2 className="truncate font-medium">{product.name}</h2>

          <p className="text-lg font-semibold">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

        </div>
      </Link>

      <div className="px-4 pb-4">
        {cartItem ? (
          <div className="flex h-9 items-center justify-between rounded-lg border bg-background px-1">
            <button type="button" onClick={() => cartItem.quantity === 1 ? dispatch(removeFromCart(product._id)) : dispatch(updateCartItemQuantity({ productId: product._id, quantity: cartItem.quantity - 1 }))} className="grid size-7 place-items-center rounded-md transition-colors hover:bg-muted" aria-label={`Remove one ${product.name}`}><Minus className="size-4" /></button>
            <span className="text-sm font-semibold" aria-live="polite">{cartItem.quantity} in cart</span>
            <button type="button" disabled={cartItem.quantity >= product.stock} onClick={() => dispatch(updateCartItemQuantity({ productId: product._id, quantity: cartItem.quantity + 1 }))} className="grid size-7 place-items-center rounded-md transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Add one ${product.name}`}><Plus className="size-4" /></button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl }))}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag className="size-4" />
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </button>
        )}
      </div>
    </article>
  );
}
