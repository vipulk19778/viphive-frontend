"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { loadRazorpay } from "@/services/razorpay/razorpay";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCreateOrderMutation } from "@/services/api/orders.api";
import {
  useCreatePaymentMutation,
  useVerifyPaymentMutation,
} from "@/services/api/payments.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cart.slice";

const initialAddress = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export function CheckoutForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const items = useAppSelector((state) => state.cart.items);
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const updateAddress = (field: keyof typeof initialAddress, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length || !user) return;
    setError("");
    setIsPaying(true);

    try {
      const order = await createOrder({
        items: items.map((item) => ({
          product: item.productId,
          qty: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        address,
        paymentId: null,
      }).unwrap();
      const payment = await createPayment({
        amount: total,
        orderId: order._id,
      }).unwrap();
      const hasRazorpay = await loadRazorpay();

      if (!hasRazorpay || !window.Razorpay) {
        throw new Error(
          "Secure payment could not be loaded. Please try again.",
        );
      }

      const razorpayCheckout = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        name: "VIPHive",
        description: `Order ${order._id.slice(-6)}`,
        order_id: payment.orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#18181b" },
        modal: { ondismiss: () => setIsPaying(false) },
        handler: async (response) => {
          try {
            await verifyPayment({ ...response, orderId: order._id }).unwrap();
            dispatch(clearCart());
            router.push("/orders?placed=1");
          } catch {
            setError(
              "Your payment was received but could not be verified. Please contact support.",
            );
            setIsPaying(false);
          }
        },
      });

      razorpayCheckout.on("payment.failed", (response) => {
        setError(
          response.error?.description ||
            "Razorpay could not accept this payment method. Please try another card.",
        );
        setIsPaying(false);
      });
      razorpayCheckout.open();
    } catch (cause) {
      setError(
        getApiErrorMessage(
          cause,
          "We could not start payment. Please try again.",
        ),
      );
      setIsPaying(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="rounded-2xl border bg-card p-5 sm:p-7">
        <p className="text-sm font-medium text-muted-foreground">
          Delivery details
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Where should we send it?
        </h1>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["fullName", "Full name", "text"],
              ["street", "Street address", "text"],
              ["city", "City", "text"],
              ["state", "State", "text"],
              ["postalCode", "Postal code", "text"],
              ["country", "Country", "text"],
            ] as const
          ).map(([field, label, type]) => (
            <label
              key={field}
              className={field === "street" ? "sm:col-span-2" : ""}
            >
              <span className="text-sm font-medium">{label}</span>
              <input
                required
                type={type}
                value={address[field]}
                onChange={(event) => updateAddress(field, event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
              />
            </label>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold">Your order</h2>
        <div className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-3">
              <span className="line-clamp-1 text-muted-foreground">
                {item.quantity} × {item.name}
              </span>
              <span>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
        <div className="my-5 border-t" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <button
          disabled={!items.length || isPaying}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPaying
            ? "Preparing payment…"
            : `Pay ₹${total.toLocaleString("en-IN")}`}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure payment powered by Razorpay
        </p>
      </aside>
    </form>
  );
}
