"use client";

import Link from "next/link";
import { LogOut, Search, ShoppingBag, UserRound } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "./theme-toggle";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials } from "@/store/slices/auth.slice";

export function Header() {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo className="text-xl" />

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/"
            className="hidden rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex"
          >
            <Search className="mr-1.5 size-4" /> Discover
          </Link>

          <Link
            href="/orders"
            className="hidden rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted md:inline-flex"
          >
            Orders
          </Link>

          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted lg:inline-flex"
            >
              Admin
            </Link>
          )}

          <Link
            href="/cart"
            className="relative inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
          >
            <ShoppingBag className="size-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {user ? (
            <button
              type="button"
              onClick={() => dispatch(clearCredentials())}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
              title="Sign out"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <UserRound className="size-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
