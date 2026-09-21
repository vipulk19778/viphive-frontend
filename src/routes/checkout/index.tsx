import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShoppingBag,
} from "lucide-react";
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
      throw redirect({
        to: "/login",
        search: { redirectTo: "/checkout" },
      });
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const totalItems = useCartStore((state) => state.getTotalItems());
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-400/30 dark:bg-slate-900 sm:p-12">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
            Payment confirmed
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
            Order placed
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Your order #{submittedOrderId.slice(-8)} was created successfully.
          </p>
          <Link
            to="/orders"
            className="mt-7 inline-flex cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F5B942] hover:text-slate-950 dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
          >
            View my orders
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="font-display mt-5 text-3xl font-bold text-slate-950 dark:text-white">
            Your cart is empty
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Add a product before checking out.
          </p>
          <Link
            to="/products"
            className="mt-7 inline-flex cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F5B942] hover:text-slate-950 dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
              Secure checkout
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
              Complete your order
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {totalItems} item{totalItems === 1 ? "" : "s"} ready for delivery.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <LockKeyhole className="h-4 w-4 text-emerald-500" /> Secure checkout
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 grid gap-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="col-span-full flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  Delivery address
                </h2>
                <p className="text-sm text-slate-500">
                  Where should we send your order?
                </p>
              </div>
            </div>
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
              <label
                key={field}
                className={`${field === "street" ? "sm:col-span-2" : ""} block`}
              >
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </span>
                <input
                  {...register(field)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-950 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                {errors[field] && (
                  <span className="mt-1 block text-sm text-red-600">
                    {errors[field]?.message}
                  </span>
                )}
              </label>
            ))}
          </div>
          <div className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Order summary
              </h2>
              <ShoppingBag className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-950 dark:text-white">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <section className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4 text-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#F5B942]" />
                <p className="text-sm font-bold">Payment method</p>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-200">
                <input
                  type="radio"
                  checked
                  readOnly
                  className="accent-[#F5B942]"
                />
                <span>
                  <strong>Razorpay</strong>
                  <span className="block text-xs text-slate-400">
                    Secure online payment
                  </span>
                </span>
              </label>
            </section>
            <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total</span>
                <span className="font-bold text-slate-950 dark:text-white">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                disabled={
                  createOrderMutation.isPending ||
                  createPaymentMutation.isPending ||
                  verifyPaymentMutation.isPending
                }
                className="mt-4 w-full cursor-pointer rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white transition hover:bg-[#F5B942] hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
              >
                {createOrderMutation.isPending ||
                createPaymentMutation.isPending ||
                verifyPaymentMutation.isPending
                  ? "Opening payment..."
                  : "Pay securely"}
              </button>
            </div>
          </div>
          {createOrderMutation.isError && (
            <p className="text-sm text-red-600">
              Unable to place the order. Please try again.
            </p>
          )}
          {paymentError && (
            <p className="text-sm text-red-600">{paymentError}</p>
          )}
        </form>
      </div>
    </main>
  );
}
