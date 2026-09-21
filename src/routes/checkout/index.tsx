import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useCreateOrder } from "@/features/orders/hooks/use-orders";
import {
  useCreatePayment,
  useVerifyPayment,
} from "@/features/payments/hooks/use-payments";
import type { OrderAddress } from "@/features/orders/types/order.types";
import { useAuthStore } from "@/stores/auth.store";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

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
  const createPaymentMutation = useCreatePayment();
  const verifyPaymentMutation = useVerifyPayment();
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderAddress>({
    resolver: zodResolver(addressSchema),
  });

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const onSubmit = async (address: OrderAddress) => {
    setPaymentError("");

    try {
      const order = await createOrderMutation.mutateAsync({
        items: items.map((item) => ({
          product: item.productId,
          qty: item.quantity,
          price: item.price,
        })),
        totalAmount: subtotal,
        address,
      });
      const paymentScriptLoaded = await loadRazorpay();
      if (!paymentScriptLoaded || !window.Razorpay) {
        setPaymentError(
          "Payment checkout could not be loaded. Please try again.",
        );
        return;
      }

      const paymentOrder = await createPaymentMutation.mutateAsync({
        amount: subtotal,
        currency: "INR",
        orderId: order._id,
      });

      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "VIPHive",
        description: "VIPHive order payment",
        order_id: paymentOrder.orderId,
        theme: { color: "#fbbf24" },
        handler: (response) => {
          void verifyPaymentMutation
            .mutateAsync({ ...response, orderId: order._id })
            .then(() => {
              clearCart();
              setSubmittedOrderId(order._id);
            })
            .catch(() =>
              setPaymentError(
                "Payment verification failed. Please contact support.",
              ),
            );
        },
        modal: {
          ondismiss: () =>
            setPaymentError(
              "Payment was cancelled. Your order is still pending payment.",
            ),
        },
      });
      razorpay.open();
    } catch {
      setPaymentError("Unable to start payment. Please try again.");
    }
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
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/30 dark:bg-amber-400/10">
          <p className="text-sm font-bold text-slate-950 dark:text-white">
            Payment method
          </p>
          <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            <input type="radio" checked readOnly className="accent-amber-500" />
            <span>
              <strong>Razorpay</strong>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Secure online payment
              </span>
            </span>
          </label>
        </section>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="font-semibold">Total: ₹{subtotal.toFixed(2)}</span>
          <button
            type="submit"
            disabled={
              createOrderMutation.isPending ||
              createPaymentMutation.isPending ||
              verifyPaymentMutation.isPending
            }
            className="cursor-pointer rounded-md bg-black px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {createOrderMutation.isPending ||
            createPaymentMutation.isPending ||
            verifyPaymentMutation.isPending
              ? "Opening payment..."
              : "Pay securely"}
          </button>
        </div>
        {createOrderMutation.isError && (
          <p className="text-sm text-red-600">
            Unable to place the order. Please try again.
          </p>
        )}
        {paymentError && <p className="text-sm text-red-600">{paymentError}</p>}
      </form>
    </main>
  );
}
