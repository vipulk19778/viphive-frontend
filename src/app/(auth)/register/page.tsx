import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-dvh bg-muted/30 p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-6xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-black/5 sm:min-h-[calc(100dvh-3rem)] lg:grid-cols-[.95fr_1.05fr]">
        <section className="flex items-center justify-center px-5 py-6 sm:px-10 sm:py-8 lg:px-14 lg:py-6">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-xl shadow-black/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/10 sm:p-6">
            <Logo className="text-lg lg:hidden" />
            <p className="mt-4 text-sm font-medium text-muted-foreground lg:mt-0">
              Join VIPHive
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              It only takes a moment. We’ll email you a verification code to
              finish setting up.
            </p>
            <div className="mt-8 border-t pt-6">
              <RegisterForm />
            </div>
            <p className="mt-7 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-secondary p-12 lg:flex lg:flex-col">
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-primary/10" />
          <Logo className="relative text-xl" />
          <div className="relative my-auto max-w-sm">
            <div className="inline-flex rounded-2xl bg-primary px-3 py-3 text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <h2 className="mt-6 text-5xl font-semibold tracking-[-0.04em]">
              Make every find feel like yours.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Save your details for an easier checkout and keep track of every
              order in one place.
            </p>
          </div>
          <p className="relative text-sm text-muted-foreground">
            Secure, simple, and always yours.
          </p>
        </section>
      </div>
    </main>
  );
}
