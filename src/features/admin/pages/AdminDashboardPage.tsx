import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Boxes,
  ClipboardList,
  IndianRupee,
  Users,
} from "lucide-react";

import { useAnalytics } from "../hooks/use-admin";

export function AdminDashboardPage() {
  const { data, isPending, isError } = useAnalytics();

  if (isPending)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading analytics...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
        Unable to load analytics.
      </div>
    );

  const cards = [
    {
      label: "Orders",
      value: data.summary.totalOrders,
      icon: ClipboardList,
      to: "/admin/orders",
    },
    {
      label: "Revenue",
      value: `₹${data.summary.totalRevenue.toFixed(2)}`,
      icon: IndianRupee,
      to: "/admin/payments",
    },
    {
      label: "Verified payments",
      value: data.summary.verifiedPayments,
      icon: Boxes,
      to: "/admin/payments",
    },
    {
      label: "Success rate",
      value: `${data.summary.successRate}%`,
      icon: Users,
      to: "/admin/users",
    },
  ] as const;

  return (
    <main>
      <p className="brand-accent text-sm font-bold uppercase tracking-[0.18em]">
        Admin overview
      </p>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            Store performance at a glance.
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor orders, payments, and revenue across VIPHive.
          </p>
        </div>
        <span className="hidden rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-400 sm:block">
          Last 30 days
        </span>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="brand-accent-soft flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="brand-accent h-4 w-4 transition" />
            </div>
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
              {value}
            </p>
          </Link>
        ))}
      </div>
      <section className="mt-7 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Payment trend
          </h2>
          <div className="mt-6 space-y-3">
            {data.recentTrend.length === 0 && (
              <p className="text-sm text-slate-500">
                No verified payments in this period.
              </p>
            )}
            {data.recentTrend.slice(-7).map((item) => (
              <div key={item._id} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-slate-500">{item._id}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="brand-primary h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (item.revenue / Math.max(data.summary.totalRevenue, 1)) * 100 * 4)}%`,
                    }}
                  />
                </div>
                <span className="w-24 text-right font-semibold text-slate-950 dark:text-white">
                  ₹{item.revenue.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Quick actions
          </h2>
          <div className="mt-5 space-y-2">
            <Link
              to="/admin/products"
              className="brand-accent-hover flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Manage products <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/admin/orders"
              className="brand-accent-hover flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Review orders <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
