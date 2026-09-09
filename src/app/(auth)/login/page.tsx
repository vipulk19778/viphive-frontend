import Link from "next/link";

import { Logo } from "@/components/common/logo";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-muted/30 p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-black/5 sm:min-h-[calc(100dvh-3rem)] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col">
          <div className="absolute -right-24 -top-20 size-80 rounded-full bg-primary-foreground/10" />
          <Logo className="relative text-xl text-primary-foreground" inverse />
          <div className="relative my-auto max-w-sm">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary-foreground/60 uppercase">
              Welcome back
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em]">
              Good things are waiting for you.
            </h1>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/70">
              Pick up where you left off, keep your favourites close, and check
              out in a few simple steps.
            </p>
          </div>
          <p className="relative text-sm text-primary-foreground/60">
            Thoughtful shopping, made simple.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl shadow-black/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10 sm:p-8">
            <Logo className="text-lg lg:hidden" />
            <p className="mt-10 text-sm font-medium text-muted-foreground lg:mt-0">
              Sign in to continue
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter your details to view orders and continue to checkout.
            </p>
            <div className="mt-8 border-t pt-6">
              <LoginForm />
            </div>
            <p className="mt-7 text-center text-sm text-muted-foreground">
              New to VIPHive?{" "}
              <Link
                href="/register"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
