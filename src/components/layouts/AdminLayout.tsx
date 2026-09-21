import { useState } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  CreditCard,
  Users,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

export function AdminLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-73px)] px-4 py-6 sm:px-6 lg:px-8 md:ml-56">
      <aside className="fixed bottom-0 left-0 top-18.25 z-40 hidden w-56 border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 md:block">
        <nav className="space-y-2">
          {navigation.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{
                className:
                  "bg-slate-950 text-white shadow-sm dark:bg-slate-800 dark:text-white",
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">
        <div className="mb-5 flex items-center justify-between md:hidden">
          <Link to="/products" className="brand-accent text-sm font-semibold">
            Storefront
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen((open) => !open)}
            aria-label={
              isMobileNavOpen
                ? "Close admin navigation"
                : "Open admin navigation"
            }
            className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isMobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        {isMobileNavOpen && (
          <nav className="mb-5 space-y-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 md:hidden">
            {navigation.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: true }}
                onClick={() => setIsMobileNavOpen(false)}
                activeProps={{
                  className:
                    "bg-slate-950 text-white dark:bg-slate-800 dark:text-white",
                }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}
        <Outlet />
      </section>
    </div>
  );
}
