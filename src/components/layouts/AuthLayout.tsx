import { Link, Outlet } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { ViphiveLogo } from "@/components/common/ViphiveLogo";

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center bg-transparent px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-300/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-32 border-amber-400/20" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-amber-400/10" />
          <ViphiveLogo />
          <div className="relative mt-24">
            <h2 className="font-display text-4xl font-bold leading-tight">
              Good things are worth keeping close.
            </h2>
            <p className="mt-5 max-w-sm leading-7 text-slate-300">
              Save your favorites, follow every order, and make your next
              discovery count.
            </p>
          </div>
          <div className="absolute bottom-10 left-10 flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck className="h-4 w-4 text-amber-400" /> A secure VIPHive
            account
          </div>
        </section>
        <section className="p-6 sm:p-10 lg:p-14">
          <Link to="/" className="lg:hidden">
            <ViphiveLogo />
          </Link>
          <div className="mt-8 lg:mt-0">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}
