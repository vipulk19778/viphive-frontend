import { Link } from "@tanstack/react-router";

import { useCartStore } from "@/features/cart/store/cart.store";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-lg border bg-white p-10 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">
            Add some products to your cart to continue.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-lg border bg-white p-4"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-md object-cover"
                />
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="h-8 w-8 rounded border"
                  >
                    -
                  </button>
                  <span className="min-w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="h-8 w-8 rounded border"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-4 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <div className="mt-6 flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-md bg-black px-4 py-3 text-center text-sm font-medium text-white"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}