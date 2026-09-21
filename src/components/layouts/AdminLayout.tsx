import { Link, Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  CreditCard,
  Users,
} from "lucide-react";

import { ViphiveLogo } from "@/components/common/ViphiveLogo";

const navigation = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/users", label: "Users", icon: Users },
] as const;

export function AdminLayout() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <aside className="hidden w-60 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
        <div className="border-b border-slate-200 px-2 pb-5 dark:border-slate-800">
          <ViphiveLogo />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Admin workspace
          </p>
        </div>
        <nav className="mt-5 space-y-1">
          {navigation.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{
                className:
                  "bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950",
              }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">
        <div className="mb-5 flex items-center justify-between md:hidden">
          <ViphiveLogo />
          <Link to="/products" className="text-sm font-semibold text-amber-600">
            Storefront
          </Link>
        </div>
        <Outlet />
      </section>
    </div>
  );
}
