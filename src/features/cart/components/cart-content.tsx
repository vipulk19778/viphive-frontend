"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "@/store/slices/cart.slice";

export function CartContent() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!items.length) {
    return (
      <section className="flex min-h-[55vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4"><ShoppingBag className="size-7" /></div>
        <h1 className="mt-5 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something you love and it will appear here.</p>
        <Link href="/" className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Browse products</Link>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="space-y-3" aria-label="Cart items">
        {items.map((item) => (
          <article key={item.productId} className="flex gap-4 rounded-xl border bg-card p-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-medium">{item.name}</h2>
              <p className="mt-1 font-semibold">₹{item.price.toLocaleString("en-IN")}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="inline-flex items-center rounded-lg border">
                  <button type="button" onClick={() => dispatch(updateCartItemQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))} className="p-1.5 hover:bg-muted" aria-label={`Decrease ${item.name} quantity`}><Minus className="size-4" /></button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button type="button" onClick={() => dispatch(updateCartItemQuantity({ productId: item.productId, quantity: item.quantity + 1 }))} className="p-1.5 hover:bg-muted" aria-label={`Increase ${item.name} quantity`}><Plus className="size-4" /></button>
                </div>
                <button type="button" onClick={() => dispatch(removeFromCart(item.productId))} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={`Remove ${item.name}`}><Trash2 className="size-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-5 flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
        <div className="mt-3 flex justify-between text-sm"><span className="text-muted-foreground">Delivery</span><span className="text-emerald-600 dark:text-emerald-400">Free</span></div>
        <div className="my-5 border-t" />
        <div className="flex justify-between font-semibold"><span>Total</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
        {isAuthenticated ? (
          <Link href="/checkout" className="mt-6 block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">Proceed to checkout</Link>
        ) : (
          <Link href="/login?next=%2Fcheckout" className="mt-6 block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">Sign in to checkout</Link>
        )}
      </aside>
    </div>
  );
}
