import { Link, createFileRoute } from "@tanstack/react-router";
import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="mx-auto w-full max-w-3xl min-w-0 overflow-x-hidden px-4 sm:px-0">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
        Account
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold text-slate-950 dark:text-white">
        Your profile
      </h1>
      <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-slate-950 px-6 py-8 text-white dark:bg-slate-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
            <UserRound className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">{user?.name}</h2>
          <p className="mt-1 text-sm text-slate-300">VIPHive member</p>
        </div>
        <div className="grid min-w-0 gap-4 p-6 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <Mail className="h-5 w-5 text-amber-600" />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-slate-950 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account status
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                Verified member
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Security
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Keep your account protected with a strong password.
              </p>
            </div>
          </div>
          <Link
            to="/change-password"
            className="brand-primary brand-primary-hover hidden cursor-pointer rounded-xl px-4 py-2 text-sm font-bold transition sm:inline-flex"
          >
            Change password
          </Link>
        </div>
        <Link
          to="/change-password"
          className="brand-primary brand-primary-hover mt-5 flex cursor-pointer justify-center rounded-xl px-4 py-3 text-sm font-bold transition sm:hidden"
        >
          Change password
        </Link>
      </section>
    </main>
  );
}
