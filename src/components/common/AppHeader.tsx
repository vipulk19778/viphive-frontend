import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
import { useAdminSearchStore } from "@/stores/admin-search.store";

export function AppHeader() {
  // Header state and shared store values.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isAdminSearchPage = pathname.startsWith("/admin/");
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = Boolean(user && token);
  const logout = useAuthStore((state) => state.logout);
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const query = useCatalogStore((state) => state.query);
  const setQuery = useCatalogStore((state) => state.setQuery);
  const adminQuery = useAdminSearchStore((state) => state.query);
  const setAdminQuery = useAdminSearchStore((state) => state.setQuery);
  const activeQuery = isAdminSearchPage ? adminQuery : query;
  const setActiveQuery = isAdminSearchPage ? setAdminQuery : setQuery;
  const [searchInput, setSearchInput] = useState(activeQuery);
  const adminSearchPlaceholder =
    pathname === "/admin/products"
      ? "Search name, description, category"
      : pathname === "/admin/orders"
        ? "Search order, customer, status"
        : pathname === "/admin/payments"
          ? "Search order, payment ID"
          : pathname === "/admin/users"
            ? "Search user, email, role, status"
            : "Search this admin section";
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "Account";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActiveQuery(searchInput.trim());
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setActiveQuery]);

  // Header actions for logout, menu closing, and product search.
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate({ to: "/" });
  };

  const closeMenu = () => setIsMenuOpen(false);

  const submitSearch = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsMenuOpen(false);
    const nextQuery = searchInput.trim();
    setActiveQuery(nextQuery);
    if (!isAdminSearchPage) void navigate({ to: "/products" });
  };

  // Shared header layout and desktop controls.
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-none">
      <div className="mx-auto flex h-18.25 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link to="/" aria-label="VIPHive home">
          <ViphiveLogo />
        </Link>
        <form
          key={isAdminSearchPage ? "admin-search" : "store-search"}
          onSubmit={submitSearch}
          className="mx-2 hidden min-w-0 flex-1 md:flex md:max-w-xl h-12"
        >
          <label className="brand-focus-within flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 shadow-sm transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:shadow-none">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={
                isAdminSearchPage
                  ? adminSearchPlaceholder
                  : "Search for products, brands and more"
              }
              className="brand-search-input min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            />
            {!isAdminSearchPage && (
              <button
                type="submit"
                aria-label="Search"
                className="brand-primary brand-primary-hover cursor-pointer rounded-lg p-1.5"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
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
              <span className="brand-primary absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>
          <div className="hidden sm:block">
            {isAuthenticated ? (
              // Desktop account menu is revealed on hover.
              <div className="group relative flex items-center gap-2">
                <div
                  aria-label="Open profile menu"
                  className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden max-w-28 truncate text-sm font-medium text-slate-700 dark:text-slate-200 lg:block">
                    {firstName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 transition group-hover:rotate-180" />
                </div>
                <div className="invisible absolute right-0 top-full z-50 w-56 translate-y-2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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
                      onClick={closeMenu}
                      className="brand-accent-hover mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className="brand-accent-hover block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        activeOptions={{ exact: true }}
                        activeProps={{
                          className:
                            "bg-slate-950 text-white dark:bg-slate-800",
                        }}
                        onClick={closeMenu}
                        className="brand-accent-hover mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Admin panel
                      </Link>
                    )}
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
                className="brand-primary brand-primary-hover rounded-lg px-4 py-2 text-sm font-semibold transition"
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
      <form onSubmit={submitSearch} className="px-4 pb-3 md:hidden h-14">
        <label className="brand-focus-within flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={
              isAdminSearchPage ? adminSearchPlaceholder : "Search products"
            }
            className="brand-search-input min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
          />
          {!isAdminSearchPage && (
            <button
              type="submit"
              aria-label="Search"
              className="brand-primary brand-primary-hover cursor-pointer rounded-lg p-1.5"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </label>
      </form>
      {/* Mobile navigation menu. */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 sm:hidden">
          <nav className="space-y-1">
            {isAuthenticated ? (
              <>
                <div className="border-b border-slate-100 px-3 pb-3 pt-1 dark:border-slate-800">
                  <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/orders"
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    activeOptions={{ exact: true }}
                    onClick={closeMenu}
                    activeProps={{
                      className: "bg-slate-950 text-white dark:bg-slate-800",
                    }}
                    className="brand-accent-hover block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Admin panel
                  </Link>
                )}
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
                className="brand-primary brand-primary-hover block rounded-xl px-3 py-3 text-center text-sm font-semibold transition"
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
