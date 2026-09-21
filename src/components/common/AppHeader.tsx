import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, ShoppingCart, Sun, User } from "lucide-react";

import { ViphiveLogo } from "./ViphiveLogo";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";

export function AppHeader() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-18.25 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="VIPHive home">
          <ViphiveLogo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            to="/products"
            className="text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            Shop
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              className="text-sm font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              Orders
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mode === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-slate-950">
                {cartItemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                aria-label="Profile"
                className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <User className="h-5 w-5" />
              </Link>
              <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                {user?.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="mr-1.5 inline h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-amber-400 dark:text-slate-950 dark:hover:bg-amber-300"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
