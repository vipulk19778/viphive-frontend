import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, User } from "lucide-react";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useAuthStore } from "@/stores/auth.store";

export function AppHeader() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  const handleLogout = () => {
    logout();

    navigate({
      to: "/",
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          VIPHive
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Products
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2 text-gray-700 hover:bg-gray-100"
          >
            <ShoppingCart className="h-5 w-5" />

            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-medium text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                aria-label="Profile"
                className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
              </Link>

              <span className="hidden text-sm font-medium sm:block">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
