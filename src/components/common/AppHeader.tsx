import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogOut,
  ChevronDown,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";

import { ViphiveLogo } from "./ViphiveLogo";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";
import { useCatalogStore } from "@/stores/catalog.store";

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const query = useCatalogStore((state) => state.query);
  const setQuery = useCatalogStore((state) => state.setQuery);
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "Account";

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate({ to: "/" });
  };

  const closeMenu = () => setIsMenuOpen(false);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsMenuOpen(false);
    void navigate({ to: "/products" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-none">
      <div className="mx-auto flex h-18.25 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link to="/" aria-label="VIPHive home">
          <ViphiveLogo />
        </Link>
        <form
          onSubmit={submitSearch}
          className="mx-2 hidden min-w-0 flex-1 md:flex md:max-w-xl"
        >
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500 dark:shadow-none">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products, brands and more"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            />
            <button
              type="submit"
              aria-label="Search"
              className="cursor-pointer rounded-lg bg-[#F5B942] p-1.5 text-slate-950 hover:bg-[#E5A52E]"
            >
              <Search className="h-4 w-4" />
            </button>
          </label>
        </form>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={toggleMode}
            aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            className="cursor-pointer rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
          <div className="hidden sm:block">
            {isAuthenticated ? (
              <div className="group relative flex items-center gap-2">
                <Link
                  to="/profile"
                  aria-label="Open profile menu"
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden max-w-28 truncate text-sm font-medium text-slate-700 dark:text-slate-200 lg:block">
                    {firstName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute right-0 top-full z-50 w-56 translate-y-2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className="border-b border-slate-100 px-3 pb-3 pt-2 dark:border-slate-800">
                      <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      My profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      My orders
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-400/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#F5B942] hover:text-slate-950 dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
              >
                Login
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <form onSubmit={submitSearch} className="px-4 pb-3 md:hidden">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 shadow-sm focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <button
            type="submit"
            aria-label="Search"
            className="cursor-pointer rounded-lg bg-[#F5B942] p-1.5 text-slate-950 hover:bg-[#E5A52E]"
          >
            <Search className="h-4 w-4" />
          </button>
        </label>
      </form>
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 sm:hidden">
          <nav className="space-y-1">
            {isAuthenticated && (
              <Link
                to="/orders"
                onClick={closeMenu}
                className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Orders
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Profile{user?.name ? ` · ${user.name}` : ""}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-400/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-xl bg-slate-950 px-3 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#F5B942] hover:text-slate-950 dark:bg-[#F5B942] dark:text-slate-950 dark:hover:bg-[#E5A52E]"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
