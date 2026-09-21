import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useCreateOrder } from "@/features/orders/hooks/use-orders";
import type { OrderAddress } from "@/features/orders/types/order.types";
import { useAuthStore } from "@/stores/auth.store";

const addressSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  street: z.string().trim().min(1, "Street is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"),
});

export const Route = createFileRoute("/checkout/")({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const createOrderMutation = useCreateOrder();
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderAddress>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = (address: OrderAddress) => {
    createOrderMutation.mutate(
      {
        items: items.map((item) => ({
          product: item.productId,
          qty: item.quantity,
          price: item.price,
        })),
        totalAmount: subtotal,
        address,
      },
      {
        onSuccess: (order) => {
          clearCart();
          setSubmittedOrderId(order._id);
        },
      },
    );
  };

  if (submittedOrderId) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Order placed</h1>
        <p className="mt-3 text-gray-600">
          Your order #{submittedOrderId.slice(-8)} was created successfully.
        </p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-600">Add a product before checking out.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4 rounded-lg border bg-white p-6"
      >
        {(
          [
            "fullName",
            "street",
            "city",
            "state",
            "postalCode",
            "country",
          ] as const
        ).map((field) => (
          <label key={field} className="block">
            <span className="text-sm font-medium capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </span>
            <input
              {...register(field)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
            {errors[field] && (
              <span className="mt-1 block text-sm text-red-600">
                {errors[field]?.message}
              </span>
            )}
          </label>
        ))}
        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-semibold">Total: ₹{subtotal.toFixed(2)}</span>
          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="rounded-md bg-black px-5 py-3 font-medium text-white disabled:bg-gray-400"
          >
            {createOrderMutation.isPending ? "Placing order..." : "Place order"}
          </button>
        </div>
        {createOrderMutation.isError && (
          <p className="text-sm text-red-600">
            Unable to place the order. Please try again.
          </p>
        )}
      </form>
    </main>
  );
}
