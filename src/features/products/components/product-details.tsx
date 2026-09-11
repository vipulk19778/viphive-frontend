"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";

import { useGetProductByIdQuery } from "@/services/api/products.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/slices/cart.slice";

interface ProductDetailsProps {
  productId: string;
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.productId === productId),
  );
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(productId);

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-lg bg-muted" />

        <div className="space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />

          <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />

          <div className="h-24 animate-pulse rounded bg-muted" />

          <div className="h-12 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-400 flex-col items-center justify-center text-center">
        <h1 className="text-xl font-semibold">Product not found</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {`We couldn't load this product.`}
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Try again
          </button>

          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] lg:gap-14">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col py-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {product.category}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-6 text-2xl font-semibold">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="my-6 h-px bg-border" />

        <div>
          <h2 className="text-sm font-medium">Description</h2>

          <p className="mt-2 leading-7 text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="mt-6">
          {isOutOfStock ? (
            <p className="font-medium text-destructive">Out of stock</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {product.stock} items available
            </p>
          )}
        </div>

        <div className="mt-8">
          {cartItem ? (
            <div className="flex items-center justify-between rounded-lg border bg-card p-1">
              <button
                type="button"
                onClick={() =>
                  cartItem.quantity === 1
                    ? dispatch(removeFromCart(product._id))
                    : dispatch(
                        updateCartItemQuantity({
                          productId: product._id,
                          quantity: cartItem.quantity - 1,
                        }),
                      )
                }
                className="grid size-10 place-items-center rounded-md transition-colors hover:bg-muted"
                aria-label={`Remove one ${product.name}`}
              >
                <Minus className="size-5" />
              </button>
              <span className="text-sm font-semibold" aria-live="polite">
                {cartItem.quantity} in cart
              </span>
              <button
                type="button"
                disabled={cartItem.quantity >= product.stock}
                onClick={() =>
                  dispatch(
                    updateCartItemQuantity({
                      productId: product._id,
                      quantity: cartItem.quantity + 1,
                    }),
                  )
                }
                className="grid size-10 place-items-center rounded-md transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Add one ${product.name}`}
              >
                <Plus className="size-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() =>
                dispatch(
                  addToCart({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                  }),
                )
              }
              className="w-full cursor-pointer rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="size-4" />
                {isOutOfStock ? "Out of stock" : "Add to cart"}
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
