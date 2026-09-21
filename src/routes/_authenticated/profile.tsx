import { createFileRoute } from "@tanstack/react-router";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="mx-auto max-w-3xl">
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
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <Mail className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
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
    </main>
  );
}
